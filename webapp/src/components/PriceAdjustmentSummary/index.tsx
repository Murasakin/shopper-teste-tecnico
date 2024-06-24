import { ParsedCSVStruct } from "../../interface";

interface PriceAdjustmentSummaryProps {
  csvData: ParsedCSVStruct;
}

// todo: this component must show product code, name, current price and new price after readjustment
function PriceAdjustmentSummary({ csvData }: PriceAdjustmentSummaryProps) {
  return (
    <table>
      <thead>
        <tr>
          {csvData.columns.map((value, index) => (
            <th key={`${value}_${index}`}>{value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {csvData.data.map((value, index) => (
          <tr key={`${value[csvData.columns[0]]}_${index}`}>
            <td>{value[csvData.columns[0]]}</td>
            <td>{value[csvData.columns[1]]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PriceAdjustmentSummary;
