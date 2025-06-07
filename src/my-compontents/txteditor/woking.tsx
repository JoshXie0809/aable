import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
}

function EditableTable() {
  const initialData: Person[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', age: 30 },
    { id: 2, firstName: 'Jane', lastName: 'Smith', age: 24 },
    { id: 3, firstName: 'Peter', lastName: 'Jones', age: 45 },
  ];

  const [data, setData] = React.useState<Person[]>(() => initialData);

  // 使用 useCallback 記憶 handleCellChange 函數
  // 並在內部處理更嚴謹的類型轉換
  const handleCellChange = React.useCallback(
    (rowIndex: number, columnId: string, value: string) => { // value 現在固定為 string，因為來自 input
      setData((oldData: Person[]) =>
        oldData.map((row: Person, index: number) => {
          if (index === rowIndex) {
            let parsedValue: string | number = value;

            // 根據 columnId 進行類型轉換
            if (columnId === 'age') {
              // 嘗試將值轉換為數字，如果無法轉換則保持原樣或設定為 0
              parsedValue = Number(value);
              // 你可能還想處理 NaN 的情況，例如 if (isNaN(parsedValue)) parsedValue = 0;
            }

            return {
              ...row,
              [columnId]: parsedValue, // 賦值轉換後的類型
            };
          }
          return row;
        })
      );
    },
    [] // handleCellChange 的依賴項為空，因為它只依賴於 setData (React保證穩定)
  );

  const handleDeleteRow = React.useCallback(
    (idToDelete: number) => {
      setData((oldData: Person[]) => oldData.filter((row: Person) => row.id !== idToDelete));
    },
    [] // handleDeleteRow 的依賴項為空
  );

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: ({ row, column, getValue }) => (
          <input
            value={getValue() as string} // 斷言為 string
            onChange={e => handleCellChange(row.index, column.id, e.target.value)}
            style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
          />
        ),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        cell: ({ row, column, getValue }) => (
          <input
            value={getValue() as string} // 斷言為 string
            onChange={e => handleCellChange(row.index, column.id, e.target.value)}
            style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
          />
        ),
      },
      {
        accessorKey: 'age',
        header: 'Age',
        cell: ({ row, column, getValue }) => (
          <input
            type="number" // 讓輸入框只接受數字
            value={getValue() as number} // 斷言為 number
            onChange={e => handleCellChange(row.index, column.id, e.target.value)}
            style={{ width: '100%', padding: '4px', boxSizing: 'border-box' }}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button onClick={() => handleDeleteRow(row.original.id)}>Delete</button>
        ),
      },
    ],
    [handleCellChange, handleDeleteRow] // 依賴於 useCallback 記憶的函數
  );

  const table = useReactTable<Person>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: Person) => row.id.toString(),
  });

  return (
    <div>
      <h1>Editable TanStack Table (TSX)</h1>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Current Table Data:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default EditableTable;