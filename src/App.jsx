import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, X, Eye, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './components/ui/Button.jsx'
import './App.css'

// 画像とプロンプトのデータを生成する関数
const generatePortfolioData = () => {
  const imageFiles = [
    'generated_image_1750667345592.jpg',
    'generated_image_1750732613157.jpg',
    'generated_image_1750732709390.jpg',
    'generated_image_1750733393245.jpg',
    'generated_image_1750736515591.jpg',
    'generated_image_1750737234606.jpg',
    'generated_image_1750737371873.jpg',
    'generated_image_1750740167351.jpg',
    'generated_image_1750740873291.jpg',
    'generated_image_1750741006500.jpg',
    'generated_image_1750741611352.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750744873728.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750746606557.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750749097416.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750750667745.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750751372531.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750752369615.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750753169034.jpg',
    'imagePrompt_imagen_3_0_generate_002_1750754605355.jpg',
    'midjourney_imagen_3_0_generate_002_1750749093535.jpg',
    'midjourney_imagen_3_0_generate_002_1750750658291.jpg',
    'midjourney_imagen_3_0_generate_002_1750752366193.jpg',
    'midjourney_imagen_3_0_generate_002_1750753164866.jpg',
    'midjourney_imagen_3_0_generate_002_1750754600266.jpg',
    'stableDiffusion_imagen_3_0_generate_002_1750749083084.jpg',
    'stableDiffusion_imagen_3_0_generate_002_1750750650169.jpg',
    'stableDiffusion_imagen_3_0_generate_002_1750752361667.jpg',
    'stableDiffusion_imagen_3_0_generate_002_1750753161074.jpg',
    'yaml_imagen_3_0_generate_002_1750749105532.jpg',
    'yaml_imagen_3_0_generate_002_1750750674231.jpg',
    'yaml_imagen_3_0_generate_002_1750752374593.jpg',
    'yaml_imagen_3_0_generate_002_1750753171964.jpg'
  ]

  return imageFiles.map((filename, index) => {
    const timestamp = filename.match(/(\d{13})/)?.[1] || '0'
    const date = new Date(parseInt(timestamp))
    
    return {
      id: `image-${index}`,
      image: `/images/${filename}`,
      promptFile: filename.replace('.jpg', '_prompt.txt'),
      title: `AI Generated Art ${index + 1}`,
      category: filename.includes('midjourney') ? 'Midjourney' : 
                filename.includes('stableDiffusion') ? 'Stable Diffusion' :
                filename.includes('imagePrompt') ? 'Image Prompt' :
                filename.includes('yaml') ? 'YAML' : 'Generated',
      date: date.toLocaleDateString('ja-JP'),
      time: date.toLocaleTimeString('ja-JP'),
      timestamp: parseInt(timestamp),
      model: filename.includes('imagen_3_0') ? 'Imagen 3.0' : 'Default'
    }
  })
}

function App() {
  const [portfolioItems, setPortfolioItems] = useState(generatePortfolioData())
  const [selectedItem, setSelectedItem] = useState(null)
  const [promptText, setPromptText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [sortBy, setSortBy] = useState('timestamp')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showSortMenu, setShowSortMenu] = useState(false)

  // ソート機能
  const sortItems = (items, sortBy, sortOrder) => {
    return [...items].sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'timestamp') {
        aValue = a.timestamp
        bValue = b.timestamp
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  // ソート条件変更時の処理
  const handleSort = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc'
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setShowSortMenu(false)
  }

  // ソートされたアイテムを取得
  const sortedItems = sortItems(portfolioItems, sortBy, sortOrder)

  // ナビゲーション機能
  const currentIndex = selectedItem ? sortedItems.findIndex(item => item.id === selectedItem.id) : -1
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < sortedItems.length - 1

  const goToPrev = () => {
    if (canGoPrev) {
      const prevItem = sortedItems[currentIndex - 1]
      setSelectedItem(prevItem)
      loadPrompt(prevItem.promptFile)
    }
  }

  const goToNext = () => {
    if (canGoNext) {
      const nextItem = sortedItems[currentIndex + 1]
      setSelectedItem(nextItem)
      loadPrompt(nextItem.promptFile)
    }
  }

  // プロンプトファイルを読み込む関数
  const loadPrompt = async (promptFile) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/prompts/${promptFile}`)
      const text = await response.text()
      setPromptText(text)
    } catch (error) {
      console.error('プロンプトの読み込みに失敗しました:', error)
      setPromptText('プロンプトの読み込みに失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  // 画像クリック時の処理
  const handleImageClick = (item) => {
    setSelectedItem(item)
    loadPrompt(item.promptFile)
  }

  // モーダルを閉じる処理
  const closeModal = () => {
    setSelectedItem(null)
    setPromptText('')
  }

  // プロンプトをクリップボードにコピーする処理
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopiedId(selectedItem.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('コピーに失敗しました:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* ヘッダー */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.h1 
            className="text-4xl font-bold text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            AI Art Portfolio
          </motion.h1>
          <motion.p 
            className="text-center text-slate-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            画像とプロンプトのポートフォリオ
          </motion.p>
        </div>
        
        {/* ソートメニュー */}
        <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700">並び替え:</span>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSortMenu(!showSortMenu)}
                    className="flex items-center gap-2"
                  >
                    <ArrowUpDown size={16} />
                    {sortBy === 'timestamp' ? '日時' : 
                     sortBy === 'category' ? 'カテゴリ' :
                     sortBy === 'model' ? 'モデル' : 'タイトル'}
                    <span className="text-xs">
                      ({sortOrder === 'asc' ? '昇順' : '降順'})
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                  
                  {showSortMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-10 min-w-[200px]">
                      {[
                        { key: 'timestamp', label: '日時' },
                        { key: 'category', label: 'カテゴリ' },
                        { key: 'model', label: 'モデル' },
                        { key: 'title', label: 'タイトル' }
                      ].map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleSort(option.key)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center justify-between ${
                            sortBy === option.key ? 'bg-slate-100 font-medium' : ''
                          }`}
                        >
                          <span>{option.label}</span>
                          {sortBy === option.key && (
                            <span className="text-xs text-slate-500">
                              {sortOrder === 'asc' ? '昇順' : '降順'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {sortedItems.length} 件の作品
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => handleImageClick(item)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={32} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 truncate">{item.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                <div className="text-xs text-slate-400 mt-1">
                  {item.date} {item.time}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* モーダル */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row">
                {/* 画像部分 */}
                <div className="lg:w-1/2">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                
                {/* プロンプト部分 */}
                <div className="lg:w-1/2 p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selectedItem.title}</h2>
                      <div className="text-sm text-slate-500 mt-1">
                        {selectedItem.date} {selectedItem.time} | {selectedItem.model}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToPrev}
                        disabled={!canGoPrev}
                        className="text-slate-500 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ChevronLeft size={20} />
                      </Button>
                      <span className="text-sm text-slate-500 px-2">
                        {currentIndex + 1} / {sortedItems.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToNext}
                        disabled={!canGoNext}
                        className="text-slate-500 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ChevronRight size={20} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeModal}
                        className="text-slate-500 hover:text-slate-700 ml-2"
                      >
                        <X size={20} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-700">プロンプト</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <Copy size={16} />
                          {copiedId === selectedItem.id ? 'コピー済み' : 'コピー'}
                        </Button>
                      </div>
                      {isLoading ? (
                        <div className="text-slate-500">読み込み中...</div>
                      ) : (
                        <div className="text-sm text-slate-600 whitespace-pre-wrap max-h-64 overflow-auto">
                          {promptText}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-500">
                    カテゴリ: {selectedItem.category}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App

