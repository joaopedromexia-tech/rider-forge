const ResponsiveTable = ({ 
  headers = [], 
  data = [], 
  className = '',
  onRowClick = null,
  emptyMessage = 'Nenhum dado encontrado'
}) => {
  if (data.length === 0) {
    return (
      <div className={`card text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-dark-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-100 mb-2">Nenhum dado</h3>
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`table-container ${className}`}>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={header.className || ''}>
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={onRowClick ? 'cursor-pointer hover:bg-dark-800/50' : ''}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className={header.cellClassName || ''}>
                    {header.render ? header.render(row[header.key], row, rowIndex) : row[header.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResponsiveTable

