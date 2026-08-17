import { Timeline } from "@/components/common/Timeline";
import type { Transaction } from "@/types";
import { TransactionPulse } from "./TransactionPulse";

interface CaisseStreamProps {
  transactions: Transaction[];
  density?: "compact" | "cozy";
}

export function CaisseStream({ transactions, density = "cozy" }: CaisseStreamProps) {
  return (
    <Timeline density={density} className="max-h-[50vh] overflow-auto pr-1">
      {transactions.map((transaction) => (
        <TransactionPulse key={transaction.id} transaction={transaction} />
      ))}
    </Timeline>
  );
}
