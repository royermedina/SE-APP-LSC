class Places {
    constructor() {
        this.items = [
            { id: 'lugares', text: 'Lugares', videoPath: 'assets/videos/Lugares/Lugares.mp4' },
            { id: 'Escuela', text: 'Escuela', videoPath: 'assets/videos/Lugares/Escuela.mp4' },
            { id: 'Hospital', text: 'Hospital', videoPath: 'assets/videos/Lugares/Hospital.mp4' },
            { id: 'Parque', text: 'Parque', videoPath: 'assets/videos/Lugares/Parque.mp4' },
            { id: 'Tienda', text: 'Tienda', videoPath: 'assets/videos/Lugares/Tienda.mp4' },
            { id: 'Trabajo', text: 'Trabajo', videoPath: 'assets/videos/Lugares/Trabajo.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 