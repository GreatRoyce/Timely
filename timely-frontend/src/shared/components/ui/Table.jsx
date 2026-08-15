import PropTypes from "prop-types";

const Table = ({ columns, rows, emptyMessage = "No records found." }) => (
  <div className="overflow-x-auto rounded-md border border-border bg-white shadow-sm">
    <table className="w-full border-collapse text-left text-md">
      <thead className="bg-primary/5 text-muted-foreground">
        <tr>
          {columns.map((column) => (
            <th className="px-4 py-3 font-semibold" key={column.key}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className="border-t border-border hover:bg-muted/50" key={row.id}>
            {columns.map((column) => (
              <td className="px-4 py-3" key={column.key}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
        {!rows.length && (
          <tr>
            <td className="px-4 py-10 text-center text-muted-foreground" colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  emptyMessage: PropTypes.string,
};

export default Table;
