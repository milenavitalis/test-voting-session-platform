import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopicCallback } from "@/common/schemas";

interface RowOptionsWithDisabled extends TopicCallback {
  disabled?: boolean;
}

interface TableWithDividersProps {
  headerOptions: Array<{ [key: string]: string | number | undefined }>;
  rowOptions: RowOptionsWithDisabled[];
  onClick: (row: RowOptionsWithDisabled) => void;
}

export default function TableWithDividers({
  headerOptions,
  rowOptions,
  onClick,
}: TableWithDividersProps) {
  return (
    <div>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent">
            {headerOptions.map((header) => (
              <TableHead key={header.value} className="text-left">
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <tbody aria-hidden="true" className="table-row h-2"></tbody>
        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
          {rowOptions.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => {
                if (!row.disabled) onClick(row);
              }}
              className={
                row.disabled
                  ? "odd:bg-gray-100 odd:hover:bg-gray-200 border-none hover:bg-gray-200 disabled:cursor-default"
                  : "odd:bg-gray-100 odd:hover:bg-gray-200 border-none hover:bg-gray-200 cursor-pointer "
              }
            >
              {headerOptions.map((header) => (
                <TableCell key={header.value} className="py-2.5">
                  {row[header.value as keyof TopicCallback] ?? "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
