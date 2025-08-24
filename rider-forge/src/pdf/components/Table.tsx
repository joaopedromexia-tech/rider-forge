import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import { TableRow } from './TableRow';
import { TableCell } from './TableCell';

export type HorizontalAlign = 'left' | 'center' | 'right';

export interface ColumnSpec {
  widthPercent: number;
  align?: HorizontalAlign;
  truncateLines?: number;
}

export interface TableProps {
  columns: ColumnSpec[]; // widths must sum to ~100
  headers: React.ReactNode[];
  rows: React.ReactNode[][];
  zebra?: boolean;
  headerBackground?: string;
  headerBorderBottomColor?: string;
  rowMinHeight?: number;
  // Pagination options. If rowsPerPage is set, header repeats each page.
  rowsPerPage?: number;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 2,
    overflow: 'hidden',
  },
});

export const paginateRows = (
  rows: React.ReactNode[][],
  options: { rowsPerPage?: number; rowHeight?: number; availableHeight?: number }
): React.ReactNode[][][] => {
  const { rowsPerPage, rowHeight, availableHeight } = options;

  let effectiveRowsPerPage = rowsPerPage;
  if (!effectiveRowsPerPage && rowHeight && availableHeight) {
    effectiveRowsPerPage = Math.max(1, Math.floor(availableHeight / rowHeight));
  }

  if (!effectiveRowsPerPage || effectiveRowsPerPage <= 0) {
    return [rows];
  }

  const pages: React.ReactNode[][][] = [];
  for (let i = 0; i < rows.length; i += effectiveRowsPerPage) {
    pages.push(rows.slice(i, i + effectiveRowsPerPage));
  }
  return pages;
};

export const Table: React.FC<TableProps> = ({
  columns,
  headers,
  rows,
  zebra = true,
  headerBackground = '#F5F7F9',
  headerBorderBottomColor = '#DDD',
  rowMinHeight,
  rowsPerPage,
}) => {
  const columnCount = columns.length;

  const renderHeader = () => (
    <TableRow backgroundColor={headerBackground} borderBottomColor={headerBorderBottomColor}>
      {headers.map((h, idx) => (
        <TableCell
          key={`h-${idx}`}
          widthPercent={columns[idx]?.widthPercent ?? 0}
          align={columns[idx]?.align ?? 'left'}
          isHeader
          showRightBorder={idx < columnCount - 1}
          padding={8}
        >
          {h}
        </TableCell>
      ))}
    </TableRow>
  );

  const renderRows = (slice: React.ReactNode[][]) => (
    <>
      {slice.map((row, rIdx) => {
        const isZebra = zebra && rIdx % 2 === 1;
        return (
          <TableRow
            key={`r-${rIdx}`}
            backgroundColor={isZebra ? '#FAFAFA' : undefined}
            borderBottomColor="#EEE"
            minHeight={rowMinHeight}
          >
            {row.map((cell, cIdx) => (
              <TableCell
                key={`c-${cIdx}`}
                widthPercent={columns[cIdx]?.widthPercent ?? 0}
                align={columns[cIdx]?.align ?? 'left'}
                truncateLines={columns[cIdx]?.truncateLines}
                showRightBorder={cIdx < columnCount - 1}
                padding={6}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  );

  // Manual pagination if rowsPerPage provided; ensures header repeats on each new page chunk
  if (rowsPerPage && rowsPerPage > 0) {
    const pages = paginateRows(rows, { rowsPerPage });
    return (
      <View style={styles.container} wrap>
        {pages.map((pageRows, pageIndex) => (
          <View key={`p-${pageIndex}`} break={pageIndex > 0} wrap>
            {renderHeader()}
            {renderRows(pageRows)}
          </View>
        ))}
      </View>
    );
  }

  // Default: single flow. Header won't auto-repeat across physical pages.
  return (
    <View style={styles.container} wrap>
      {renderHeader()}
      {renderRows(rows)}
    </View>
  );
};

export default Table;


