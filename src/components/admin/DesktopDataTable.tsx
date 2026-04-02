import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Download, MoreHorizontal, Eye, Edit3, Trash2 } from 'lucide-react';
import { colors } from '../../theme/warmDusk';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  actions?: { icon: any; label: string; onClick: (row: any) => void; color?: string }[];
  onRowClick?: (row: any) => void;
  emptyState?: React.ReactNode;
}

const Badge = ({ text, color }: { text: string; color: string }) => (
  <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
    {text}
  </span>
);

export default function DesktopDataTable({ 
  columns, 
  data, 
  searchable = true, 
  filterable = false,
  selectable = false,
  actions = [],
  onRowClick,
  emptyState
}: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const filteredData = React.useMemo(() => {
    if (!searchQuery) return sortedData;
    
    return sortedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [sortedData, searchQuery]);

  const toggleRowSelection = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id)));
    }
  };

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textTertiary }} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 pr-4 py-2 rounded-lg bg-white/30 border border-white/30 outline-none text-sm"
                  style={{ color: colors.textPrimary }}
                />
              </div>
            )}
            
            {selectable && selectedRows.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                  {selectedRows.size} selected
                </span>
                <button className="px-3 py-1.5 rounded-lg bg-white/30 hover:bg-white/40 transition-all text-sm">
                  Bulk Action
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {filterable && (
              <button className="p-2 rounded-lg bg-white/30 hover:bg-white/40 transition-all">
                <Filter className="w-4 h-4" style={{ color: colors.textSecondary }} />
              </button>
            )}
            
            <button className="p-2 rounded-lg bg-white/30 hover:bg-white/40 transition-all">
              <Download className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 bg-white/20">
              {selectable && (
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    onChange={toggleAllSelection}
                    className="rounded"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left p-4 font-semibold text-sm ${column.sortable ? 'cursor-pointer hover:bg-white/10' : ''}`}
                  style={{ color: colors.textPrimary, width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'asc' 
                              ? 'opacity-100' : 'opacity-30'
                          }`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${
                            sortConfig?.key === column.key && sortConfig.direction === 'desc' 
                              ? 'opacity-100' : 'opacity-30'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              
              {actions.length > 0 && (
                <th className="w-20 p-4 text-center">
                  <span className="text-sm font-semibold" style={{ color: colors.textPrimary }}>Actions</span>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="p-8 text-center">
                  {emptyState || (
                    <div className="text-center">
                      <div className="text-lg font-medium mb-2" style={{ color: colors.textPrimary }}>
                        No data found
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        {searchQuery ? `No results for "${searchQuery}"` : 'No data available'}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`border-b border-white/10 hover:bg-white/20 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(row.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleRowSelection(row.id);
                        }}
                        className="rounded"
                      />
                    </td>
                  )}
                  
                  {columns.map((column) => (
                    <td key={column.key} className="p-4 text-sm" style={{ color: colors.textPrimary }}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  
                  {actions.length > 0 && (
                    <td className="p-4 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === row.id ? null : row.id);
                        }}
                        className="p-1 rounded hover:bg-white/30 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" style={{ color: colors.textSecondary }} />
                      </button>
                      
                      {activeDropdown === row.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setActiveDropdown(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 min-w-[120px] bg-white/90 backdrop-blur-xl rounded-lg shadow-lg border border-white/30 py-1">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                  setActiveDropdown(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/30 transition-all text-left"
                                style={{ color: action.color || colors.textPrimary }}
                              >
                                <action.icon className="w-4 h-4" />
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="p-4 border-t border-white/20 flex items-center justify-between bg-white/10">
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            Showing {filteredData.length} of {data.length} entries
          </div>
          
          {selectable && (
            <div className="text-sm" style={{ color: colors.textSecondary }}>
              {selectedRows.size} selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-configured table components for common use cases
export const UserTable = ({ users, onEdit, onView, onDelete }: {
  users: any[];
  onEdit: (user: any) => void;
  onView: (user: any) => void;
  onDelete: (user: any) => void;
}) => {
  const columns: Column[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (status) => <Badge text={status} color={status === 'active' ? colors.strava : colors.periodka} />
    },
    { key: 'plan', label: 'Plan', sortable: true },
    { key: 'joined', label: 'Joined', sortable: true, render: (date) => new Date(date).toLocaleDateString() },
    { 
      key: 'credits', 
      label: 'Credits', 
      sortable: true, 
      render: (credits) => `€${(credits / 100).toFixed(2)}` 
    }
  ];

  const actions = [
    { icon: Eye, label: 'View', onClick: onView, color: colors.accent },
    { icon: Edit3, label: 'Edit', onClick: onEdit, color: colors.telo },
    { icon: Trash2, label: 'Delete', onClick: onDelete, color: colors.periodka }
  ];

  return (
    <DesktopDataTable
      columns={columns}
      data={users}
      selectable
      actions={actions}
    />
  );
};