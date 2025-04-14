import React, { useState } from 'react';
import { ChartBarIcon, BeakerIcon } from '@heroicons/react/24/outline';
import ResultsChart from './components/ResultsChart';

function App() {
  const [formData, setFormData] = useState({
    exhaleInhale: Array(8).fill(''),
    frontRear: Array(8).fill(''),
    leftRight: Array(8).fill(''),
    monthsAfterCalving: '',
    temperature: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/classification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          measurements: {
            exhaleInhale: formData.exhaleInhale.map(Number),
            frontRear: formData.frontRear.map(Number),
            leftRight: formData.leftRight.map(Number)
          },
          monthsAfterCalving: Number(formData.monthsAfterCalving),
          temperature: Number(formData.temperature)
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index, type) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [type]: type.includes('Right') || type.includes('Rear') || type.includes('Inhale')
        ? [...prev[type].slice(0, index), value, ...prev[type].slice(index + 1)]
        : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cow Mastitis Detection System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Enter measurements to analyze cow health status
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Measurement Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['exhaleInhale', 'frontRear', 'leftRight'].map((type) => (
                <div key={type} className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <BeakerIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    {type.replace(/([A-Z])/g, ' $1').trim()} Measurements
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Array(8).fill().map((_, index) => (
                      <input
                        key={index}
                        type="number"
                        value={formData[type][index]}
                        onChange={(e) => handleChange(e, index, type)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder={`Value ${index + 1}`}
                        required
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Months After Calving
                </label>
                <input
                  type="number"
                  value={formData.monthsAfterCalving}
                  onChange={(e) => handleChange(e, null, 'monthsAfterCalving')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleChange(e, null, 'temperature')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Health Status'}
                <ChartBarIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className={`p-4 rounded-lg ${
                  result.classification === 'healthy' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <h3 className="text-lg font-medium mb-2">Classification</h3>
                  <p className="text-2xl font-bold capitalize">
                    {result.classification}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div>
                <ResultsChart data={formData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
