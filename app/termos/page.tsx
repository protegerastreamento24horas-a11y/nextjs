export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Termos de Uso</h1>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-300 mb-4">
              Ao acessar e utilizar o site Rifa Premiada, você concorda em cumprir estes termos de uso, 
              todas as leis e regulamentos aplicáveis, e reconhece que é responsável pelo cumprimento 
              de todas as leis locais aplicáveis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Uso do Serviço</h2>
            <p className="text-gray-300 mb-4">
              O serviço Rifa Premiada permite que os usuários participem de rifas online para concorrer 
              a diversos prêmios. Ao utilizar nosso serviço, você concorda em:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Fornecer informações verdadeiras e precisas durante o registro</li>
              <li>Manter suas informações de conta seguras e confidenciais</li>
              <li>Utilizar o serviço apenas para fins legítimos</li>
              <li>Não interferir ou interromper o serviço ou servidores e redes conectadas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Compras e Pagamentos</h2>
            <p className="text-gray-300 mb-4">
              Ao adquirir bilhetes em nossas rifas, você concorda com os seguintes termos:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Os pagamentos são processados através de sistemas de pagamento seguros</li>
              <li>Os bilhetes são não reembolsáveis, exceto conforme exigido por lei</li>
              <li>Os prêmios serão entregues conforme as especificações de cada rifa</li>
              <li>O Rifa Premiada se reserva o direito de alterar os prêmios mediante aviso prévio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitação de Responsabilidade</h2>
            <p className="text-gray-300 mb-4">
              O Rifa Premiada não será responsável por quaisquer danos diretos, indiretos, incidentais, 
              especiais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar nosso serviço.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Alterações nos Termos</h2>
            <p className="text-gray-300 mb-4">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações 
              entrarão em vigor imediatamente após serem publicadas no site. É sua responsabilidade 
              revisar periodicamente estes termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contato</h2>
            <p className="text-gray-300">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do 
              nosso formulário de contato ou pelo e-mail: suporte@rifapremiada.com.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}