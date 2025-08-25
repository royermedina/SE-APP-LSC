class CommonObjects {
    constructor() {
        this.items = [
            { id: 'objetos', text: 'Objetos', videoPath: 'assets/videos/ObjetosComunes/ObjetosComunes.mp4' },
            { id: 'Agua', text: 'Agua', videoPath: 'assets/videos/ObjetosComunes/Agua.mp4' },
            { id: 'Casa', text: 'Casa', videoPath: 'assets/videos/ObjetosComunes/Casa.mp4' },
            { id: 'Libro', text: 'Libro', videoPath: 'assets/videos/ObjetosComunes/Libro.mp4' },
            { id: 'Silla', text: 'Silla', videoPath: 'assets/videos/ObjetosComunes/Silla.mp4' },
            { id: 'Telefono', text: 'Telefono', videoPath: 'assets/videos/ObjetosComunes/Telefono.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 