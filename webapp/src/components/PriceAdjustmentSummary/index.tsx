import { ValidationResultStruct } from "../../interface";
import styles from "./PriceAdjustmentSummary.module.css";

interface PriceAdjustmentSummaryProps {
  summary: ValidationResultStruct;
}

function PriceAdjustmentSummary({ summary }: PriceAdjustmentSummaryProps) {
  return (
    <div className={styles["container"]}>
      <table className={styles["table"]}>
        <thead className={styles["head"]}>
          <tr className={styles["head-row"]}>
            <th>Código</th>
            <th>Nome</th>
            <th>Preço Atual</th>
            <th>Novo Preço</th>
            <th>Inconsitências</th>
          </tr>
        </thead>
        <tbody className={styles["body"]}>
          {summary.results.map((value, index) => (
            <tr key={`${value.code}_${index}`} className={styles["row"]}>
              <td className={styles["cell"]}>{value.code}</td>
              <td className={styles["cell"]}>{value.productName}</td>
              <td className={styles["cell"]}>{value.currentPrice}</td>
              <td className={styles["cell"]}>{value.readjustedPrice}</td>
              <td className={styles["cell"]}>{value.error}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PriceAdjustmentSummary;
