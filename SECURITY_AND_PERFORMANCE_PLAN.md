# Plano de Melhoria de Segurança e Desempenho - Sara Ramos

Este documento detalha as vulnerabilidades encontradas e as ações necessárias para garantir a segurança máxima e o desempenho do site de vendas.

## 1. Segurança Crítica (Prioridade Alta)

### 1.1. Validação de Preços no Checkout (ANTI-FRAUDE)

**Problema:** Atualmente, o endpoint de checkout (`app/api/checkout/route.ts`) confia no preço enviado pelo front-end (`req.json()`). Um usuário mal-intencionado pode interceptar a requisição e enviar `{ "price": 0 }` para "comprar" itens de graça.
**Solução:**

- O backend **NUNCA** deve confiar em dados sensíveis vindos do cliente.
- Ao receber o pedido de checkout, o servidor deve buscar os preços reais dos produtos diretamente no banco de dados (Firestore) usando os IDs enviados.
- **Implementação:** Alterar `route.ts` para ler a coleção `products` do Firestore e verificar o preço de cada item.

### 1.2. Permissões do Banco de Dados (Firestore Rules)

**Problema:** As regras atuais permitem que **qualquer usuário autenticado** crie, edite ou exclua produtos (`allow create, update, delete: if request.auth != null`). Isso significa que qualquer cliente logado pode apagar seu catálogo de produtos.
**Solução:**

- Implementar verificação de ADMIN.
- **Implementação:** Definir quais UIDs são admins ou adicionar um claim customizado. Como solução imediata, permitir escrita apenas para um UID específico (o seu) ou verificar um campo `role: 'admin'` no documento do usuário.

### 1.3. Headers de Segurança (Middleware)

**Problema:** Faltam cabeçalhos HTTP de segurança que protegem contra ataques comuns (XSS, Clickjacking).
**Solução:**

- Criar um `middleware.ts` para injetar headers de segurança.
- **Headers Recomendados:**
  - `Content-Security-Policy` (CSP)
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Strict-Transport-Security` (HSTS)

## 2. Segurança de Dados (LGPD/GDPR)

### 2.1. Vazamento de Dados no Checkout

**Problema:** O envio de metadados excessivos ou dados de usuário não sanitizados para o Stripe.
**Solução:**

- Enviar apenas o necessário (`userId`, `orderId`) nos metadados do Stripe.
- Garantir que o `customer_email` seja validado no backend.

### 2.2. Autenticação Robusta

**Recomendação:**

- Se estiver usando Firebase Auth, garantir que o "Sign-in method" esteja configurado para não permitir múltiplos cadastros com o mesmo email se não for desejado.
- Forçar senhas fortes no frontend (se usar login por email/senha).

## 3. Desempenho e Otimização

### 3.1. Otimização de Imagens

**Ação:** Usar o componente `<Image />` do Next.js para todas as imagens de produtos.
**Benefício:** Carregamento mais rápido, formato WebP automático e Lazy Loading.

### 3.2. Cache de Consultas

**Ação:** Ao buscar produtos no Firestore (tanto no front quanto no back), utilizar cache/revalidação do Next.js (`revalidate: 3600`) para não bater no banco a cada refresh, economizando quota do Firebase e acelerando o carregamento.

### 3.3. Bundle Size

**Ação:** Verificar se bibliotecas pesadas (como o SDK completo do Firebase) estão sendo importadas apenas onde necessário. Usar _Tree Shaking_.

## 4. Plano de Ação Imediato

1. **FIX P1:** Corrigir `firestore.rules` imediatamente para evitar vandalismo.
2. **FIX P1:** Refatorar `checkout/route.ts` para buscar preços no Firestore.
3. **IMP:** Criar `middleware.ts` com headers de segurança.
