import React from 'react';
import { cn } from '../../../utils/helpers/classnames';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="table-responsive">
      <table className={cn('table', className)} {...props}>
        {children}
      </table>
    </div>
  );
};
