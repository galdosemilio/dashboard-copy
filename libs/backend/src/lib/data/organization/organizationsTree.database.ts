import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { Organization, OrganizationSingle } from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import { ClinicFlatNode, ClinicNode, NodeType } from './organization.types'

export const NodeTypes = {
  parentNode: 'parentNode',
  childNode: 'childNode',
  leafNode: 'leafNode'
}

@Injectable()
export class OrganizationsTreeDatabase {
  dataChange = new BehaviorSubject<any[]>([])
  nodeMap = new Map<string, ClinicNode>()

  constructor(private organization: Organization) {}

  rootLevelNodes = [
    {
      nodeName: _('ADMIN.ORGS.PARENT_ORG'),
      nodeType: NodeTypes.parentNode
    },
    {
      nodeName: _('ADMIN.ORGS.CHILD_ORGS'),
      nodeType: NodeTypes.childNode
    }
  ]

  initialize(org: OrganizationSingle) {
    this.nodeMap.clear()
    this.dataChange.next([])

    const data = this.rootLevelNodes.map((node) =>
      this.generateNode(node.nodeName, node.nodeType, org)
    )
    this.getParentClinic(data[0])
    this.getChildClinics(data[1])
    this.dataChange.next(data)
  }

  loadMore(node: ClinicFlatNode, expand: boolean) {
    const parent = this.nodeMap.get(node.nodeName) as ClinicNode
    if (expand && parent.children.length > 0) {
      return
    }
    if (node.nodeType === NodeTypes.parentNode) {
      this.getParentClinic(node)
    } else {
      this.getChildClinics(node)
    }
  }

  getChildClinics(node: ClinicFlatNode) {
    let parent = this.nodeMap.get(node.nodeName) as ClinicNode
    if (node.nodeName === 'LOAD_MORE') {
      parent = this.nodeMap.get(node.loadMoreParentItem as string) as ClinicNode
    }
    const offset = parent.children.length > 0 ? parent.children.length - 1 : 0
    this.organization
      .getDescendants({
        id: parent.org.id,
        limit: 10,
        offset: offset,
        organization: parent.org.id
      })
      .then((res) => {
        const newNodes = res.data.map((organization) =>
          this.generateNode(
            organization.name,
            NodeTypes.leafNode,
            organization as OrganizationSingle
          )
        )
        parent.children.splice(-1, 1)
        let nodes = [...parent.children, ...newNodes]
        if (res.pagination.next) {
          nodes.push(
            new ClinicNode('LOAD_MORE', 'leafNode', parent.org, node.nodeName)
          )
        }
        if (res.data.length === 0) {
          nodes = [this.generateNode('NO_CHILD', 'leafNode', parent.org)]
        }
        parent.childrenChange.next(nodes)
        this.dataChange.next(this.dataChange.value)
      })
      .catch(console.error)
  }

  getParentClinic(node: ClinicFlatNode) {
    const parent = this.nodeMap.get(node.nodeName) as ClinicNode
    if (parent.children.length === 0) {
      this.organization
        .getSingle(node.org.id)
        .then((org) => {
          if (org.hierarchyPath.length === 1) {
            parent.childrenChange.next([
              this.generateNode('NO_PARENT', 'leafNode', parent.org)
            ])
            this.dataChange.next(this.dataChange.value)
          } else {
            this.organization
              .getSingle(org.hierarchyPath[1])
              .then((res) => {
                parent.childrenChange.next([
                  this.generateNode(res.name, 'leafNode', res)
                ])
                this.dataChange.next(this.dataChange.value)
              })
              .catch(console.error)
          }
        })
        .catch(console.error)
    }
  }

  private generateNode(
    nodeName: string,
    nodeType: string,
    org: OrganizationSingle
  ): ClinicNode {
    if (this.nodeMap.has(nodeName)) {
      return this.nodeMap.get(nodeName) as ClinicNode
    }

    const result = new ClinicNode(nodeName, nodeType as NodeType, org)
    this.nodeMap.set(nodeName, result)
    return result
  }
}
