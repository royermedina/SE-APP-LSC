class GreetingsIntroductions {
    constructor() {
        this.items = [
            { id: 'saludos', text: 'Saludos', videoPath: 'assets/videos/SaludosyPresentaciones/SaludosyPresentaciones.mp4' },
            { id: 'hola', text: 'Hola', videoPath: 'assets/videos/SaludosyPresentaciones/Hola.mp4' },
            { id: 'buenos_dias', text: 'Buenos días', videoPath: 'assets/videos/SaludosyPresentaciones/BuenosDias.mp4' },
            { id: 'buenas_tardes', text: 'Buenas tardes', videoPath: 'assets/videos/SaludosyPresentaciones/BuenasTardes.mp4' },
            { id: 'buenas_noches', text: 'Buenas noches', videoPath: 'assets/videos/SaludosyPresentaciones/BuenasNoches.mp4' },
            { id: 'me_llamo', text: 'Me llamo...', videoPath: 'assets/videos/SaludosyPresentaciones/MeLlamo.mp4' },
            { id: 'mucho_gusto', text: 'Mucho gusto', videoPath: 'assets/videos/SaludosyPresentaciones/EncantandodeConocerte.mp4' },
            { id: 'como_estas', text: '¿Cómo estás?', videoPath: 'assets/videos/SaludosyPresentaciones/ComoEsta.mp4' },
            { id: 'Adios', text: 'Adios', videoPath: 'assets/videos/SaludosyPresentaciones/Adios.mp4' },
            { id: 'HastaLuego', text: 'HastaLuego', videoPath: 'assets/videos/SaludosyPresentaciones/HastaLuego.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 