import { useNavigate } from 'react-router-dom'
import { useStageplot } from '../../context/StagePlotContext'
import { useRider } from '../../context/RiderContext'

function StagePlot({ riderId, formData, onChange }) {
  const navigate = useNavigate()
  const { getStageplotByRiderId, canSaveStageplot, isPro } = useStageplot()
  const { savedRiders } = useRider()
  
  const currentStageplot = getStageplotByRiderId(riderId)
  const rider = savedRiders.find(r => r.id === riderId)
  
  const handleOpenEditor = () => {
    navigate(`/stage-plot-creator?riderId=${riderId || 'new'}`)
  }

  const canSave = canSaveStageplot(riderId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Stage Plot</h2>
            <p className="text-gray-400 text-sm">
              Create a visual stage plot for your band setup
            </p>
          </div>
          
          {/* Pro Badge */}
          {!isPro && (
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Free: {savedRiders.length}/2 riders
            </div>
          )}
        </div>
      </div>

      {/* Current Stage Plot Status */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        {currentStageplot ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-100">{currentStageplot.title}</h3>
                <p className="text-gray-400 text-sm">
                  Created: {new Date(currentStageplot.createdAt).toLocaleDateString()}
                  {currentStageplot.updatedAt !== currentStageplot.createdAt && (
                    <span> • Updated: {new Date(currentStageplot.updatedAt).toLocaleDateString()}</span>
                  )}
                </p>
              </div>
              <button
                onClick={handleOpenEditor}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Edit Stage Plot
              </button>
            </div>

            {/* Stage Plot Preview */}
            {currentStageplot.png && (
              <div className="border border-dark-600 rounded-lg p-4 bg-dark-900">
                <img 
                  src={currentStageplot.png} 
                  alt="Stage Plot Preview"
                  className="max-w-full h-auto rounded border border-dark-600"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zm-4 3v14h14V6H5zm2 2h10v2H7V8zm0 4h10v2H7v-2zm0 4h6v2H7v-2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">No Stage Plot Created</h3>
            <p className="text-gray-400 mb-4">
              Create a visual stage plot to show your band's stage setup and equipment placement.
            </p>
            
            {canSave ? (
              <button
                onClick={handleOpenEditor}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Create Stage Plot
              </button>
            ) : (
              <div className="text-center">
                <p className="text-yellow-400 mb-2">
                  Free version limit reached
                </p>
                <p className="text-gray-400 text-sm">
                  Free users can save stage plots for up to 2 riders. You currently have {savedRiders.length} riders.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features List */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-lg font-medium text-gray-100 mb-4">Stage Plot Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="text-green-400 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-gray-100 font-medium">Equipment Library</h4>
              <p className="text-gray-400 text-sm">Drag and drop instruments, amps, and stage equipment</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-green-400 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-gray-100 font-medium">Customizable Risers</h4>
              <p className="text-gray-400 text-sm">Add custom-sized risers with real measurements</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-green-400 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-gray-100 font-medium">Notes & Observations</h4>
              <p className="text-gray-400 text-sm">Add special requirements and notes</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="text-green-400 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-gray-100 font-medium">Export as PNG</h4>
              <p className="text-gray-400 text-sm">Download high-quality images for sharing</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default StagePlot
