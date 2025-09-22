import { ChartItem } from "@/components/ui/charts/bar-charts";
import { GenericBarChartVertical } from "@/components/ui/charts/bar-charts";

// Exemple d'utilisation avec des données de démonstration
const DemoPage: React.FC = () => {
  const sampleData: ChartItem[] = [
    { key: "Technology", value: 18.1 },
    { key: "Utilities", value: 14.3 },
    { key: "Energy", value: 27.1 },
    { key: "Cyclicals", value: 40 },
    { key: "Defensive", value: 12.7 },
    { key: "Financials", value: 22.8 },
  ];

  return (
    <div className="h-screen flex items-center justify-center gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Données par Secteur (Thème Fuchsia)
        </h2>
        <GenericBarChartVertical
          data={sampleData}
          singleColor="fuchsia"
          showTooltips={true}
          showLabels={true}
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Données par Secteur (Thème Blue)
        </h2>
        <GenericBarChartVertical
          data={sampleData}
          singleColor="blue"
          showTooltips={true}
          showLabels={true}
          className="max-w-sm"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Couleurs Personnalisées
        </h2>
        <GenericBarChartVertical
          data={sampleData}
          customColors={[
            "#ff6b6b",
            "#4ecdc4",
            "#45b7d1",
            "#96ceb4",
            "#ffeead",
            "#d4a5a5",
          ]}
          showTooltips={true}
          showLabels={false}
        />
      </div>
    </div>
  );
};

export default DemoPage;
