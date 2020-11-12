import { SectionProps } from '@app/shared/components/app-section/app-section.props'
import { Subject } from 'rxjs'
import { PackageSelectorElement } from './package.interface'

export class PackageSelectorProps extends SectionProps {
  forcePackageSelection?: boolean
  packages?: PackageSelectorElement[]
  trackerPackage?: PackageSelectorElement

  constructor(args: PackageSelectorProps) {
    super()
    this.forcePackageSelection = args.forcePackageSelection
    this.packages = args.packages || []
    this.trackerPackage = args.trackerPackage
    this.events = {
      forcePackageSelection:
        args && args.events && args.events.forcePackageSelection
          ? args.events.forcePackageSelection
          : new Subject<boolean>()
    }
  }
}
