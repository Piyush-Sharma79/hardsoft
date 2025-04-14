import React, { useState } from 'react';
import { ChartBarIcon, InformationCircleIcon, BeakerIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import ResultsChart from './components/ResultsChart';

function App() {
  const [formData, setFormData] = useState({
    IUFL: '', EUFL: '', IUFR: '', EUFR: '',
    IURL: '', EURL: '', IURR: '', EURR: '',
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
          udderMeasurements: {
            IUFL: Number(formData.IUFL),
            EUFL: Number(formData.EUFL),
            IUFR: Number(formData.IUFR),
            EUFR: Number(formData.EUFR),
            IURL: Number(formData.IURL),
            EURL: Number(formData.EURL),
            IURR: Number(formData.IURR),
            EURR: Number(formData.EURR)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-indigo-100 rounded-full mb-3">
            <BeakerIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Cow Mastitis Detection System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced early detection system utilizing precise udder measurements
          </p>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Form */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                  <BeakerIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Udder Measurements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Front Left', inhale: 'IUFL', exhale: 'EUFL' },
                    { title: 'Front Right', inhale: 'IUFR', exhale: 'EUFR' },
                    { title: 'Rear Left', inhale: 'IURL', exhale: 'EURL' },
                    { title: 'Rear Right', inhale: 'IURR', exhale: 'EURR' }
                  ].map(quarter => (
                    <div key={quarter.title} className="bg-gray-50 rounded-xl p-3 space-y-3">
                      <h4 className="font-medium text-gray-900 text-sm">{quarter.title}</h4>
                      <div className="space-y-2">
                        <input
                          type="number"
                          name={quarter.inhale}
                          value={formData[quarter.inhale]}
                          onChange={handleChange}
                          placeholder={`Inhale (${quarter.inhale})`}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                          required
                        />
                        <input
                          type="number"
                          name={quarter.exhale}
                          value={formData[quarter.exhale]}
                          onChange={handleChange}
                          placeholder={`Exhale (${quarter.exhale})`}
                          className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Months After Calving
                  </label>
                  <input
                    type="number"
                    name="monthsAfterCalving"
                    value={formData.monthsAfterCalving}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    required
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? 'Analyzing...' : 'Analyze Health Status'}
                  <ChartBarIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Info Card */}
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-2 bg-blue-100 rounded-full">
                  <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Understanding Mastitis</h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Mastitis is an inflammation of the mammary gland and udder tissue in dairy cows. It's one of the most critical diseases affecting dairy cattle worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-red-50 rounded-xl p-4">
                    <h3 className="font-semibold text-red-800 mb-2 text-sm">Impact on Production</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Reduced milk production</li>
                      <li>Poor milk quality</li>
                      <li>Increased treatment costs</li>
                      <li>Potential udder damage</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-semibold text-green-800 mb-2 text-sm">Prevention Benefits</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                      <li>Maintain milk quality</li>
                      <li>Reduce treatment costs</li>
                      <li>Improve herd health</li>
                      <li>Increase farm profitability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-6 bg-white shadow-xl rounded-2xl p-6 transform transition-all duration-500 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              {result.classification === 'healthy' ? (
                <ShieldCheckIcon className="h-6 w-6 mr-2 text-green-600" />
              ) : (
                <ExclamationTriangleIcon className="h-6 w-6 mr-2 text-red-600" />
              )}
              Analysis Results
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className={`p-6 rounded-xl border-2 ${
                  result.classification === 'healthy'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <h3 className="text-xl font-medium mb-4">Classification</h3>
                  <p className={`text-4xl font-bold capitalize mb-4 ${
                    result.classification === 'healthy' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {result.classification}
                  </p>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Confidence Level</span>
                      <span className="text-sm font-medium text-gray-900">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          result.classification === 'healthy' ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Recommendations:</h4>
                    <ul className="space-y-3">
                      {result.classification === 'healthy' ? (
                        <>
                          <li className="flex items-center text-green-700">
                            <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            Continue regular monitoring
                          </li>
                          <li className="flex items-center text-green-700">
                            <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            Maintain current hygiene practices
                          </li>
                          <li className="flex items-center text-green-700">
                            <ShieldCheckIcon className="h-5 w-5 mr-2" />
                            Schedule next check-up as planned
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center text-red-700">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            Consult veterinarian immediately
                          </li>
                          <li className="flex items-center text-red-700">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            Isolate affected quarters
                          </li>
                          <li className="flex items-center text-red-700">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            Begin recommended treatment protocol
                          </li>
                          <li className="flex items-center text-red-700">
                            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                            Increase monitoring frequency
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
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
