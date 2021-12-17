import { FlatTreeControl } from '@angular/cdk/tree'
import { Component, Input, OnInit } from '@angular/core'
import {
  MatDialog,
  MatTreeFlatDataSource,
  MatTreeFlattener
} from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'

import {
  ClinicFlatNode,
  ClinicNode,
  OrganizationsTreeDatabase
} from '@coachcare/backend/data'
import { OrganizationSingle } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { PromptDialogData } from '@coachcare/common/dialogs/core'
import { NotifierService } from '@coachcare/common/services'
import { CcrAddOrganizationDialog } from '@coachcare/common/dialogs'
import {
  CcrOrganizationDialogs,
  OrganizationParams
} from '@coachcare/common/services/organization'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'ccr-organization-tree-page',
  templateUrl: './organization-tree.component.html',
  styleUrls: ['./organization-tree.component.scss']
})
export class CcrOrganizationTreePageComponent implements OnInit {
  @Input() organization: OrganizationSingle
  @Input() readonly: boolean

  nodeMap = new Map<string, ClinicFlatNode>()
  treeControl: FlatTreeControl<ClinicFlatNode>
  treeFlattener: MatTreeFlattener<ClinicNode, ClinicFlatNode>
  dataSource: MatTreeFlatDataSource<ClinicNode, ClinicFlatNode>

  constructor(
    private database: OrganizationsTreeDatabase,
    private route: ActivatedRoute,
    private notifier: NotifierService,
    private dialogs: CcrOrganizationDialogs,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data: OrganizationParams) => {
      if (data.org) {
        this.organization = data.org
      }
    })

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    )

    this.database.initialize(this.organization)

    this.treeControl = new FlatTreeControl<ClinicFlatNode>(
      this.getLevel,
      this.isExpandable
    )

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    )

    this.database.dataChange.subscribe((data) => {
      this.dataSource.data = data
    })

    this.treeControl.expand(this.treeControl.dataNodes[0])
  }

  transformer = (node: ClinicNode, level: number) => {
    const existingNode = this.nodeMap.get(node.nodeName)

    if (existingNode) {
      return existingNode
    }

    const newNode = {
      nodeName: node.nodeName,
      nodeType: node.nodeType,
      org: node.org,
      loadMoreParentItem: node.loadMoreParentItem
    }

    this.nodeMap.set(node.nodeName, newNode)

    return newNode
  }

  getLevel(node: ClinicFlatNode): number {
    return node.nodeType === 'leafNode' ? 1 : 0
  }

  isEmpty(node: ClinicFlatNode): boolean {
    if (node.nodeName !== 'NO_CHILD' && node.nodeName !== 'NO_PARENT') {
      return false
    }
    return true
  }

  isExpandable(node: ClinicFlatNode): boolean {
    return node.nodeType === 'leafNode' ? false : true
  }

  getChildren(node: ClinicNode): Observable<ClinicNode[]> {
    return node.childrenChange
  }

  hasChild(n: number, nodeData: ClinicFlatNode): boolean {
    return nodeData.nodeType === 'leafNode' ? false : true
  }

  isLoadMore(n: number, nodeData: ClinicFlatNode): boolean {
    return nodeData.nodeName === 'LOAD_MORE'
  }

  loadMore(node: ClinicFlatNode): void {
    this.database.loadMore(node, false)
  }

  loadChildren(node: ClinicFlatNode) {
    this.database.loadMore(node, true)
  }

  createDialog(node: ClinicFlatNode) {
    this.dialog
      .open(CcrAddOrganizationDialog, {
        data: {
          accountType: 'coach',
          title:
            node.nodeType === 'childNode'
              ? _('SHARED.ORGS.ADD_CHILD_ORG')
              : _('SHARED.ORGS.ADD_PARENT_ORG'),
          organization: node.org.id,
          addChild: node.nodeType === 'childNode'
        },
        disableClose: true,
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(filter((res) => res))
      .subscribe(() => {
        this.database.initialize(this.organization)
        this.treeControl.expand(this.treeControl.dataNodes[0])
      })
  }

  onDelete(node: ClinicFlatNode) {
    const data: PromptDialogData = {
      title: node.org.hierarchyPath.includes(this.organization.id)
        ? _('SHARED.ORGS.CONFIRM_REMOVE_CHILD')
        : _('SHARED.ORGS.CONFIRM_REMOVE_PARENT'),
      content: node.org.hierarchyPath.includes(this.organization.id)
        ? _('SHARED.ORGS.CONFIRM_REMOVE_CHILD_PROMPT')
        : _('SHARED.ORGS.CONFIRM_REMOVE_PARENT_PROMPT'),
      contentParams: { item: `${node.org.name}` }
    }

    const org = node.org.hierarchyPath.includes(this.organization.id)
      ? node.org
      : this.organization
    this.dialogs
      .removePrompt(org, data)
      .then(() => {
        this.database.initialize(this.organization)
        this.treeControl.expand(this.treeControl.dataNodes[0])
        this.notifier.success(_('NOTIFY.SUCCESS.CLINIC_REMOVED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }
}
