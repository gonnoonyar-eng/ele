--- src/App.tsx (原始)
export default function App() {
  return (
    <div/>
  );
}


+++ src/App.tsx (修改后)
import { useState, useCallback } from 'react';

// Допустимые буквы в российских номерах (совпадают с латинскими)
const VALID_LETTERS = ['А', 'В', 'Е', 'К', 'М', 'Н', 'О', 'Р', 'С', 'Т', 'У', 'Х'];

// Популярные коды регионов
const REGION_CODES = [
  '01', '02', '03', '04', '05', '07', '08', '09', '10', '11',
  '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
  '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',
  '32', '33', '34', '35', '36', '37', '38', '39', '40', '41',
  '42', '43', '44', '45', '46', '47', '48', '49', '50', '51',
  '52', '53', '54', '55', '56', '57', '58', '59', '60', '61',
  '62', '63', '64', '65', '66', '67', '68', '69', '70', '71',
  '72', '73', '74', '75', '76', '77', '78', '79', '86', '89',
  '90', '91', '92', '93', '95', '97', '98', '99',
  '102', '116', '123', '124', '125', '126', '134', '136', '138',
  '142', '150', '152', '154', '159', '161', '163', '164', '174',
  '177', '178', '186', '190', '196', '197', '199', '716', '750',
  '761', '777', '790', '797', '799'
];

interface GeneratedPlate {
  id: number;
  letter1: string;
  numbers: string;
  letter2: string;
  letter3: string;
  region: string;
}

function getRandomLetter(): string {
  return VALID_LETTERS[Math.floor(Math.random() * VALID_LETTERS.length)];
}

function getRandomNumbers(): string {
  return String(Math.floor(100 + Math.random() * 900));
}

function getRandomRegion(): string {
  return REGION_CODES[Math.floor(Math.random() * REGION_CODES.length)];
}

function generatePlate(id: number): GeneratedPlate {
  return {
    id,
    letter1: getRandomLetter(),
    numbers: getRandomNumbers(),
    letter2: getRandomLetter(),
    letter3: getRandomLetter(),
    region: getRandomRegion(),
  };
}

function PlateVisual({ plate }: { plate: GeneratedPlate }) {
  const fullNumber = `${plate.letter1}${plate.numbers}${plate.letter2}${plate.letter3}`;

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-800 p-3 sm:p-4 mx-auto max-w-sm">
      <div className="flex items-center justify-between">
        {/* Основная часть номера */}
        <div className="flex items-center gap-1">
          <span className="text-3xl sm:text-5xl font-bold tracking-wider text-gray-900 font-mono">
            {plate.letter1}
          </span>
          <span className="text-3xl sm:text-5xl font-bold tracking-wider text-gray-900 font-mono">
            {plate.numbers}
          </span>
          <span className="text-3xl sm:text-5xl font-bold tracking-wider text-gray-900 font-mono">
            {plate.letter2}{plate.letter3}
          </span>
        </div>

        {/* Разделитель */}
        <div className="w-px h-12 bg-gray-400 mx-2"></div>

        {/* Регион */}
        <div className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono">
            {plate.region}
          </span>
          <div className="flex items-center gap-1 mt-1">
            {/* Флаг РФ */}
            <div className="w-4 h-3 flex flex-col rounded-sm overflow-hidden border border-gray-300">
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-blue-600"></div>
              <div className="flex-1 bg-red-600"></div>
            </div>
            <span className="text-[8px] sm:text-[10px] font-bold text-gray-700">RUS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [plates, setPlates] = useState<GeneratedPlate[]>([generatePlate(1)]);
  const [counter, setCounter] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    const newCounter = counter + 1;
    setCounter(newCounter);
    setPlates(prev => [generatePlate(newCounter), ...prev].slice(0, 20));
  }, [counter]);

  const handleGenerateMultiple = useCallback((count: number) => {
    const newPlates: GeneratedPlate[] = [];
    let currentCounter = counter;
    for (let i = 0; i < count; i++) {
      currentCounter++;
      newPlates.push(generatePlate(currentCounter));
    }
    setCounter(currentCounter);
    setPlates(prev => [...newPlates, ...prev].slice(0, 20));
  }, [counter]);

  const handleCopy = useCallback((plate: GeneratedPlate) => {
    const text = `${plate.letter1}${plate.numbers}${plate.letter2}${plate.letter3} ${plate.region}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(plate.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  }, []);

  const handleClear = useCallback(() => {
    const newPlate = generatePlate(counter + 1);
    setCounter(counter + 1);
    setPlates([newPlate]);
  }, [counter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl">🚗</div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Генератор автономеров РФ</h1>
              <p className="text-xs sm:text-sm text-blue-300/80">Генерация случайных российских автомобильных номеров</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
        {/* Текущий номер */}
        <section className="mb-8">
          <div className="flex flex-col items-center gap-6">
            <PlateVisual plate={plates[0]} />

            {/* Кнопки управления */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🎲 Сгенерировать номер
              </button>
              <button
                onClick={() => handleGenerateMultiple(5)}
                className="px-5 py-3 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                ×5
              </button>
              <button
                onClick={() => handleGenerateMultiple(10)}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                ×10
              </button>
            </div>
          </div>
        </section>

        {/* Информация о формате */}
        <section className="mb-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span>ℹ️</span> Формат номера РФ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-blue-200/80">
            <div>
              <p className="mb-1"><span className="text-white font-medium">Формат:</span> Х000ХХ + код региона</p>
              <p className="mb-1"><span className="text-white font-medium">Буквы:</span> А, В, Е, К, М, Н, О, Р, С, Т, У, Х</p>
              <p><span className="text-white font-medium">Цифры:</span> 3 цифры (100–999)</p>
            </div>
            <div>
              <p className="mb-1"><span className="text-white font-medium">Код региона:</span> 2–3 цифры</p>
              <p className="mb-1"><span className="text-white font-medium">Всего регионов:</span> {REGION_CODES.length}</p>
              <p><span className="text-white font-medium">Пример:</span> А123ВС 77</p>
            </div>
          </div>
        </section>

        {/* История */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>📋</span> История ({plates.length})
            </h2>
            {plates.length > 1 && (
              <button
                onClick={handleClear}
                className="px-3 py-1.5 text-sm bg-red-600/20 hover:bg-red-600/40 text-red-300 rounded-lg transition-colors"
              >
                Очистить
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {plates.map((plate, index) => (
              <div
                key={plate.id}
                className={`relative bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-300 p-3 hover:bg-white/10 ${
                  index === 0 ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-lg font-bold tracking-wide">
                    <span className="text-blue-300">{plate.letter1}</span>
                    <span className="text-white">{plate.numbers}</span>
                    <span className="text-blue-300">{plate.letter2}{plate.letter3}</span>
                    <span className="text-gray-400 mx-1">|</span>
                    <span className="text-yellow-300">{plate.region}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(plate)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Копировать"
                  >
                    {copiedId === plate.id ? (
                      <span className="text-green-400 text-sm">✓</span>
                    ) : (
                      <span className="text-gray-400 hover:text-white text-sm">📋</span>
                    )}
                  </button>
                </div>
                {index === 0 && (
                  <span className="absolute -top-2 left-3 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    текущий
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
          Генератор автомобильных номеров РФ • Только для развлекательных целей
        </div>
      </footer>
    </div>
  );
}
