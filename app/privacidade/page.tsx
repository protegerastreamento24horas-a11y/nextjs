export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Política de Privacidade</h1>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Informações que Coletamos</h2>
            <p className="text-gray-300 mb-4">
              Coletamos informações que você nos fornece diretamente, como quando:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Se registra em nossa plataforma</li>
              <li>Participa de rifas e compra bilhetes</li>
              <li>Entra em contato com nosso suporte</li>
              <li>Preenche formulários em nosso site</li>
            </ul>
            <p className="text-gray-300 mt-4">
              As informações que coletamos podem incluir: nome, endereço de e-mail, informações de pagamento, 
              dados demográficos e preferências de comunicação.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Como Usamos suas Informações</h2>
            <p className="text-gray-300 mb-4">
              Utilizamos as informações coletadas para:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Fornecer e melhorar nossos serviços de rifas</li>
              <li>Processar suas compras e entregar prêmios</li>
              <li>Enviar comunicações sobre rifas, promoções e atualizações</li>
              <li>Personalizar sua experiência em nossa plataforma</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Compartilhamento de Informações</h2>
            <p className="text-gray-300 mb-4">
              Não vendemos, trocamos ou alugamos suas informações pessoais para terceiros. Podemos 
              compartilhar suas informações apenas nas seguintes circunstâncias:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Com prestadores de serviço que nos auxiliam na operação do site</li>
              <li>Para cumprir obrigações legais ou ordens judiciais</li>
              <li>Para proteger os direitos, propriedade ou segurança do Rifa Premiada e seus usuários</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Segurança das Informações</h2>
            <p className="text-gray-300 mb-4">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações 
              pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, 
              nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Seus Direitos</h2>
            <p className="text-gray-300 mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Acessar as informações pessoais que mantemos sobre você</li>
              <li>Corrigir informações imprecisas</li>
              <li>Solicitar a exclusão de suas informações pessoais</li>
              <li>Retirar seu consentimento para o processamento de dados</li>
              <li>Portabilidade dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contato</h2>
            <p className="text-gray-300">
              Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus direitos, 
              entre em contato conosco através do nosso formulário de contato ou pelo e-mail: 
              privacidade@rifapremiada.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}