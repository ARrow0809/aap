import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, X, Eye, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './components/ui/Button.jsx'
import './App.css'

// 画像とプロンプトのデータを生成する関数
const generatePortfolioData = () => {
  const imageFiles = [
    'generated_image_1750433720511.jpg',
    'generated_image_1750433955248.jpg',
    'generated_image_1750434038018.jpg',
    'generated_image_1750434047746.jpg',
    'generated_image_1750434058460.jpg',
    'generated_image_1750434070532.jpg',
    'generated_image_1750434871466.jpg',
    'generated_image_1750434890011.jpg',
    'generated_image_1750434907400.jpg',
    'generated_image_1750445958255.jpg',
    'generated_image_1750495249993.jpg',
    'generated_image_1750495269971.jpg',
    'generated_image_1750495277561.jpg',
    'generated_image_1750495322711.jpg',
    'generated_image_1750497165481.jpg',
    'generated_image_1750505114916.jpg',
    'generated_image_1750505124256.jpg',
    'generated_image_1750505128865.jpg',
    'generated_image_1750566093105.jpg',
    'generated_image_1750566910674.jpg',
    'generated_image_1750567481617.jpg',
    'generated_image_1750568076787.jpg',
    'generated_image_1750568447590.jpg',
    'generated_image_1750568621584.jpg',
    'generated_image_1750584140043.jpg',
    'generated_image_1750584173827.jpg',
    'generated_image_1750585399038.jpg',
    'generated_image_1750585435921.jpg',
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
  const [selectedCategory, setSelectedCategory] = useState('all')

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

  // カテゴリフィルタリング
  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory)

  // ソートされたアイテムを取得
  const sortedItems = sortItems(filteredItems, sortBy, sortOrder)

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
        
        {/* フィルター・ソートメニュー */}
        <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">カテゴリ:</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="all">すべて</option>
                    <option value="Stable Diffusion">Stable Diffusion</option>
                    <option value="Midjourney">Midjourney</option>
                    <option value="Image Prompt">Image Prompt</option>
                    <option value="YAML">YAML</option>
                    <option value="Generated">Generated</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">並び替え:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="timestamp">日付</option>
                    <option value="time">時間</option>
                    <option value="model">プロンプトモデル</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">順序:</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="desc">降順</option>
                    <option value="asc">昇順</option>
                  </select>
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
                <p className="text-sm font-medium text-slate-800">{item.category}</p>
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
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 左ナビゲーション */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrev}
                disabled={!canGoPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white disabled:opacity-30 rounded-full w-12 h-12 p-0"
              >
                <ChevronLeft size={24} />
              </Button>
              
              {/* 右ナビゲーション */}
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                disabled={!canGoNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white disabled:opacity-30 rounded-full w-12 h-12 p-0"
              >
                <ChevronRight size={24} />
              </Button>
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
                      <h2 className="text-2xl font-bold text-slate-800">{selectedItem.category}</h2>
                      <div className="text-sm text-slate-500 mt-1">
                        {selectedItem.date} {selectedItem.time} | {selectedItem.model}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 px-2">
                        {currentIndex + 1} / {sortedItems.length}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeModal}
                        className="text-slate-500 hover:text-slate-700"
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

