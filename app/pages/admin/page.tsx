'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useProducts, Product, ProductCategory } from '../../context/ProductsContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Package, 
  Video,
  Gamepad,
  Scissors,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Image as ImageIcon,
  FileText,
  Download,
  Users
} from 'lucide-react';
import Image from 'next/image';

type ProductType = 'video' | 'jogo' | 'atividade';

const productTypeOptions: { value: ProductType; label: string; icon: React.ReactNode }[] = [
  { value: 'atividade', label: 'Atividade', icon: <Scissors className="w-4 h-4" /> },
  { value: 'video', label: 'Vídeo', icon: <Video className="w-4 h-4" /> },
  { value: 'jogo', label: 'Jogo', icon: <Gamepad className="w-4 h-4" /> },
];

const categoryOptions: { value: ProductCategory; label: string }[] = [
  { value: 'alfabetizacao', label: '🔡 Alfabetização e Leitura' },
  { value: 'escrita', label: '✍️ Escrita e Caligrafia' },
  { value: 'matematica', label: '🧮 Matemática Divertida' },
  { value: 'logica', label: '🧠 Lógica e Raciocínio' },
  { value: 'coordenacao', label: '🤸 Coordenação Motora' },
  { value: 'artes', label: '🎨 Artes e Cores' },
  { value: 'ciencias', label: '🦖 Natureza e Ciências' },
  { value: 'musica', label: '🎼 Musicalização' },
  { value: 'socioemocional', label: '💝 Socioemocional' },
  { value: 'geral', label: '✨ Diversos' },
];

const ageRangeOptions = [
  { value: '0-2', label: '🍼 0 a 2 anos' },
  { value: '3-4', label: '🪁 3 a 4 anos' },
  { value: '5-6', label: '🚀 5 a 6 anos' },
  { value: '7-9', label: '🛸 7 a 9 anos' },
  { value: '10+', label: '🪐 10 anos ou mais' },
  { value: 'todas', label: '♾️ Todas as idades' },
];

interface ProductForm {
  title: string;
  description: string;
  price: string;
  type: ProductType;
  category: ProductCategory;
  ageRange: string;
  imageUrl: string;
  downloadUrl: string;
  downloadPath: string;
  isActive: boolean;
}

const initialForm: ProductForm = {
  title: '',
  description: '',
  price: '',
  type: 'atividade',
  category: 'geral',
  ageRange: 'todas',
  imageUrl: '',
  downloadUrl: '',
  downloadPath: '',
  isActive: true,
};

// Format value as Brazilian currency
function formatCurrency(value: string): string {
  // Remove everything except digits
  const digits = value.replace(/\D/g, '');
  
  // If empty, return empty
  if (!digits) return '';
  
  // Convert to number (in cents)
  const number = parseInt(digits, 10);
  
  // Format as currency
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(number / 100);
  
  return formatted;
}

// Parse currency string to cents
function parseCurrencyToCents(value: string): number {
  const digits = value.replace(/\D/g, '');
  return parseInt(digits, 10) || 0;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadFileProgress, setUploadFileProgress] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const digitalFileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/pages/login');
    }
  }, [user, isAdmin, authLoading, router]);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle price input with currency mask
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatCurrency(rawValue);
    setForm({ ...form, price: formatted });
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    setUploadProgress('Enviando imagem...');

    try {
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `products/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);

      // Upload file
      setUploadProgress('Fazendo upload...');
      await uploadBytes(storageRef, file);

      // Get download URL
      setUploadProgress('Obtendo URL...');
      const downloadURL = await getDownloadURL(storageRef);

      // Update form with image URL
      setForm({ ...form, imageUrl: downloadURL });
      setUploadProgress('');
      showMessage('success', 'Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Erro ao enviar imagem. Verifique as permissões do Storage.');
    } finally {
      setUploading(false);
      setUploadProgress('');
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle digital file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      showMessage('error', 'O arquivo deve ter no máximo 100MB');
      return;
    }

    setUploadingFile(true);
    setUploadFileProgress('Enviando arquivo...');

    try {
      const timestamp = Date.now();
      const fileName = `digital-downloads/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);

      setUploadFileProgress('Fazendo upload...');
      await uploadBytes(storageRef, file);

      setUploadFileProgress('Obtendo URL...');
      const downloadURL = await getDownloadURL(storageRef);
      // We also store the full path for secure server-side generation
      const fullPath = storageRef.fullPath;

      setForm({ ...form, downloadUrl: downloadURL, downloadPath: fullPath });
      setUploadFileProgress('');
      showMessage('success', 'Arquivo anexado com sucesso!');
    } catch (error) {
      console.error('Error uploading file:', error);
      showMessage('error', 'Erro ao enviar arquivo.');
    } finally {
      setUploadingFile(false);
      setUploadFileProgress('');
      if (digitalFileInputRef.current) {
        digitalFileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.price) {
      showMessage('error', 'Título e preço são obrigatórios');
      return;
    }

    if (!form.downloadUrl) {
      showMessage('error', 'O arquivo digital é obrigatório para todos os produtos');
      return;
    }

    setSaving(true);
    try {
      const priceInCents = parseCurrencyToCents(form.price);
      
      const productData = {
        title: form.title,
        description: form.description,
        price: priceInCents,
        type: form.type,
        category: form.category,
        ageRange: form.ageRange,
        imageUrl: form.imageUrl,
        downloadUrl: form.downloadUrl,
        downloadPath: form.downloadPath,
        isActive: form.isActive,
      };

      if (editingId) {
        await updateProduct(editingId, productData);
        showMessage('success', 'Produto atualizado com sucesso!');
      } else {
        await addProduct(productData);
        showMessage('success', 'Produto adicionado com sucesso!');
      }

      setForm(initialForm);
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      description: product.description,
      price: formatCurrency(String(product.price)),
      type: product.type,
      category: product.category || 'geral',
      ageRange: product.ageRange || 'todas',
      imageUrl: product.imageUrl || '',
      downloadUrl: product.downloadUrl || '',
      downloadPath: product.downloadPath || '',
      isActive: product.isActive,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      showMessage('success', 'Produto excluído com sucesso!');
      setDeleteConfirm(null);
    } catch (err) {
      showMessage('error', err instanceof Error ? err.message : 'Erro ao excluir produto');
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setShowForm(false);
    setEditingId(null);
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  if (authLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Package className="w-8 h-8 text-pink-500" />
              Painel Administrativo
            </h1>
            <p className="text-gray-500 mt-1">Gerencie os produtos da plataforma</p>
          </div>
          <button
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Product Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingId ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Nome do produto"
                    required
                  />
                </div>

                {/* Price with Currency Mask */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço *
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={handlePriceChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all font-mono"
                    placeholder="R$ 0,00"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Digite apenas os números</p>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as ProductType })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    {productTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Age Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faixa Etária
                  </label>
                  <select
                    value={form.ageRange}
                    onChange={(e) => setForm({ ...form, ageRange: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    {ageRangeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Descrição do produto"
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-1" />
                    Imagem do Produto
                  </label>
                  
                  <div className="flex gap-4">
                    {/* Upload Button */}
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          uploading 
                            ? 'border-pink-300 bg-pink-50 cursor-not-allowed' 
                            : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'
                        }`}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
                            <span className="text-pink-600">{uploadProgress}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-600">Fazer upload de imagem</span>
                          </>
                        )}
                      </label>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 5MB</p>
                    </div>

                    {/* URL Input */}
                    <div className="flex-1">
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                        placeholder="Ou cole uma URL de imagem"
                      />
                    </div>
                  </div>

                  {/* Image Preview */}
                  {form.imageUrl && (
                    <div className="mt-4 relative inline-block w-32 h-32 rounded-xl border border-gray-200 overflow-hidden">
                      <Image
                        src={form.imageUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized // Permite preview de URLs externas no admin sem whitelist rígida
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: '' })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Digital File Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Arquivo Digital (para download após compra) *
                  </label>
                  
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        ref={digitalFileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="digital-file-upload"
                      />
                      <label
                        htmlFor="digital-file-upload"
                        className={`flex flex-col items-center justify-center gap-2 w-full px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                          uploadingFile 
                            ? 'border-blue-300 bg-blue-50 cursor-not-allowed' 
                            : 'border-blue-200 bg-blue-50 hover:border-blue-500 hover:bg-blue-100'
                        }`}
                      >
                        {uploadingFile ? (
                          <>
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            <span className="text-blue-600 font-medium">{uploadFileProgress}</span>
                          </>
                        ) : (
                          <>
                            <div className="bg-white p-3 rounded-full shadow-sm">
                              <Upload className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="text-center">
                              <span className="text-blue-700 font-bold block mb-1">
                                {form.downloadUrl ? 'Substituir arquivo atual' : 'Adicionar Arquivo Digital'}
                              </span>
                              <span className="text-xs text-blue-500">
                                PDF, ZIP, RAR (até 100MB)
                              </span>
                            </div>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* File Preview/Status */}
                  {form.downloadUrl && (
                    <div className="mt-2 flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg border border-green-200 w-fit">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Arquivo anexado e pronto para venda!</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, downloadUrl: '' })}
                        className="ml-2 text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                        title="Remover anexo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Active */}
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Produto ativo (visível para clientes)
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving || uploading || uploadingFile}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {editingId ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 border-2 border-gray-200 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Produtos ({products.length})
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Nenhum produto cadastrado</p>
              <p className="text-gray-400 text-sm mt-1">
                Clique em &quot;Novo Produto&quot; para começar
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4 w-full sm:w-auto">
                      {/* Product Image or Icon */}
                      {product.imageUrl ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                          product.type === 'video' ? 'bg-purple-100' :
                          product.type === 'jogo' ? 'bg-green-100' :
                          product.type === 'atividade' ? 'bg-yellow-100' :
                          'bg-pink-100'
                        }`}>
                          {product.type === 'video' ? '🎬' :
                           product.type === 'jogo' ? '🎮' :
                           product.type === 'atividade' ? '✂️' :
                           '🎁'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-800 flex flex-wrap items-center gap-2">
                          <span className="truncate">{product.title}</span>
                          {!product.isActive && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Inativo
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize flex flex-wrap items-center gap-2 mt-1">
                          {product.type}
                          {product.downloadUrl && (
                             <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                               <Download className="w-3 h-3" />
                               Digital
                             </span>
                          )}
                          {product.ageRange && (
                             <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                               <Users className="w-3 h-3" />
                               {ageRangeOptions.find(o => o.value === product.ageRange)?.label || product.ageRange}
                             </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pl-16 sm:pl-0">
                      <span className="font-bold text-lg text-pink-600">
                        {formatPrice(product.price)}
                      </span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 whitespace-nowrap"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-2 ml-16">
                      {product.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
