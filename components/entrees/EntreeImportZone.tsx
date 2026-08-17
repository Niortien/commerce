interface EntreeImportZoneProps {
  onDropCsv?: () => void;
}

export function EntreeImportZone({ onDropCsv }: EntreeImportZoneProps) {
  return (
    <div
      className="rounded-lg border border-dashed border-border/80 bg-[linear-gradient(145deg,rgba(57,211,83,0.08),rgba(34,54,81,0.7))] p-6 text-sm text-text-muted transition hover:border-accent hover:text-text"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropCsv?.();
      }}
    >
      Glisse un fichier CSV pour pr&eacute;-remplir la liste d&apos;entr&eacute;es
    </div>
  );
}
