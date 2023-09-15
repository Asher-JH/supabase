import * as Tooltip from '@radix-ui/react-tooltip'
import clsx from 'clsx'
import { ENTITY_TYPE } from 'data/entity-types/entity-type-constants'
import { Entity } from 'data/entity-types/entity-type-query'
import { BASE_PATH } from 'lib/constants'
import Link from 'next/link'
import SVG from 'react-inlinesvg'
import {
  DropdownMenuContent_Shadcn_,
  DropdownMenuItem_Shadcn_,
  DropdownMenuSeparator_Shadcn_,
  DropdownMenuTrigger_Shadcn_,
  DropdownMenu_Shadcn_,
  IconChevronDown,
  IconCopy,
  IconEdit,
  IconLock,
  IconTrash,
} from 'ui'

export interface EntityListItemProps {
  id: number
  projectRef: string
  item: Entity
  isLocked: boolean
  onEditTable: (table: Entity) => void
  onDeleteTable: (table: Entity) => void
  onDuplicateTable: (table: Entity) => void
  isLoadingTableMetadata?: boolean
}

const EntityListItem = ({
  id,
  projectRef,
  item: entity,
  isLocked,
  onEditTable,
  onDeleteTable,
  onDuplicateTable,
  isLoadingTableMetadata,
}: EntityListItemProps) => {
  const isActive = Number(id) === entity.id
  const formatTooltipText = (entityType: string) => {
    return Object.entries(ENTITY_TYPE)
      .find(([, value]) => value === entityType)?.[0]
      ?.toLowerCase()
      ?.split('_')
      ?.join(' ')
  }

  return (
    <div
      className={clsx(
        'group flex items-center justify-between rounded-md',
        isActive && 'text-scale-1200 bg-scale-300'
      )}
    >
      <Link href={`/project/${projectRef}/editor/${entity.id}`}>
        <a className="flex items-center py-1 px-3 w-full space-x-3 max-w-[90%]">
          <Tooltip.Root delayDuration={0} disableHoverableContent={true}>
            <Tooltip.Trigger className="flex items-center">
              {entity.type === ENTITY_TYPE.TABLE ? (
                <SVG
                  className="table-icon"
                  src={`${BASE_PATH}/img/icons/table-icon.svg`}
                  style={{ width: `16px`, height: `16px`, strokeWidth: '1px' }}
                  preProcessor={(code: any) =>
                    code.replace(/svg/, 'svg class="m-auto text-color-inherit"')
                  }
                />
              ) : entity.type === ENTITY_TYPE.VIEW ? (
                <SVG
                  className="view-icon"
                  src={`${BASE_PATH}/img/icons/view-icon.svg`}
                  style={{ width: `16px`, height: `16px`, strokeWidth: '1px' }}
                  preProcessor={(code: any) =>
                    code.replace(/svg/, 'svg class="m-auto text-color-inherit"')
                  }
                />
              ) : (
                <div
                  className={clsx(
                    'flex items-center justify-center text-xs h-4 w-4 rounded-[2px] font-bold',
                    entity.type === ENTITY_TYPE.FOREIGN_TABLE && 'text-yellow-900 bg-yellow-500',
                    entity.type === ENTITY_TYPE.MATERIALIZED_VIEW &&
                      'text-purple-1000 bg-purple-500',
                    entity.type === ENTITY_TYPE.PARTITIONED_TABLE && 'text-scale-1100 bg-scale-800'
                  )}
                >
                  {Object.entries(ENTITY_TYPE)
                    .find(([, value]) => value === entity.type)?.[0]?.[0]
                    ?.toUpperCase()}
                </div>
              )}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow className="radix-tooltip-arrow" />
                <div
                  className={[
                    'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                    'border border-scale-200',
                  ].join(' ')}
                >
                  <span className="text-xs text-scale-1200 capitalize">
                    {formatTooltipText(entity.type)}
                  </span>
                </div>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
          <p className="text-sm text-scale-1100 group-hover:text-scale-1200 transition max-w-[85%] overflow-hidden text-ellipsis whitespace-nowrap">
            {/* only show tooltips if required, to reduce noise */}
            {entity.name.length > 20 ? (
              <Tooltip.Root delayDuration={0} disableHoverableContent={true}>
                <Tooltip.Trigger className="max-w-[95%] overflow-hidden text-ellipsis whitespace-nowrap">
                  {entity.name}
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content side="bottom">
                    <Tooltip.Arrow className="radix-tooltip-arrow" />
                    <div
                      className={[
                        'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                        'border border-scale-200',
                      ].join(' ')}
                    >
                      <span className="text-xs text-scale-1200">{entity.name}</span>
                    </div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ) : (
              entity.name
            )}
          </p>
        </a>
      </Link>
      <div className="pr-3">
        {entity.type === ENTITY_TYPE.TABLE && isActive && !isLocked && (
          <DropdownMenu_Shadcn_>
            <DropdownMenuTrigger_Shadcn_>
              <div className="text-scale-900 transition-colors hover:text-scale-1200">
                <IconChevronDown size={14} strokeWidth={2} />
              </div>
            </DropdownMenuTrigger_Shadcn_>
            <DropdownMenuContent_Shadcn_ side="bottom" align="start">
              <DropdownMenuItem_Shadcn_
                key="edit-table"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditTable(entity)
                }}
                disabled={isLoadingTableMetadata}
              >
                <IconEdit size="tiny" />
                <p className="text-scale-1200 text-sm">Edit Table</p>
              </DropdownMenuItem_Shadcn_>
              <DropdownMenuItem_Shadcn_
                key="duplicate-table"
                onClick={(e) => {
                  e.stopPropagation()
                  onDuplicateTable(entity)
                }}
                disabled={isLoadingTableMetadata}
              >
                <IconCopy size="tiny" />
                <p className="text-scale-1200 text-sm">Duplicate Table</p>
              </DropdownMenuItem_Shadcn_>
              <Link
                key="view-policies"
                href={`/project/${projectRef}/auth/policies?search=${entity.id}`}
              >
                <a>
                  <DropdownMenuItem_Shadcn_ key="delete-table">
                    <IconLock size="tiny" />
                    <p className="text-scale-1200 text-sm">View Policies</p>
                  </DropdownMenuItem_Shadcn_>
                </a>
              </Link>
              <DropdownMenuSeparator_Shadcn_ key="separator" />,
              <DropdownMenuItem_Shadcn_
                key="delete-table"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteTable(entity)
                }}
                disabled={isLoadingTableMetadata}
              >
                <IconTrash size="tiny" />
                <p className="text-scale-1200 text-sm">Delete Table</p>
              </DropdownMenuItem_Shadcn_>
            </DropdownMenuContent_Shadcn_>
          </DropdownMenu_Shadcn_>
        )}
      </div>
    </div>
  )
}

export default EntityListItem
