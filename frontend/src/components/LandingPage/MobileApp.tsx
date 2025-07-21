const MobileApp = () => {
  return (
    <section className="w-full bg-gradient-to-r from-pink-400 to-red-400 text-white text-center px-4 py-20">
      
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Votre nouvelle App musical</h2>
      <p className="max-w-xl mx-auto mb-10">
        Interface intuitive, design moderne et fonctionnalités avancées pour une expérience utilisateur exceptionnelle.
      </p>

      {/* Mockup iPhone simplifié */}
      <div className="w-48 h-96 mx-auto bg-white rounded-3xl shadow-lg p-2 flex items-center justify-center">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          {/* Ici tu peux mettre un placeholder de carte ou une vraie map plus tard */}
          <img src="/map-placeholder.png" alt="Carte" className="w-4/5 h-4/5 object-contain" />
        </div>
      </div>

    </section>
  );
};

export default MobileApp;
