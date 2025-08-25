class FoodDrinks {
    constructor() {
        this.items = [
            { id: 'Alimentos_Bebidas', text: 'Alimentos y Bebidas', videoPath: 'assets/videos/BebidasyAlimentos/AlimentosyBebidas.mp4' },
            { id: 'Carne', text: 'Carne', videoPath: 'assets/videos/BebidasyAlimentos/Carne.mp4' },
            { id: 'Fruta', text: 'Fruta', videoPath: 'assets/videos/BebidasyAlimentos/Fruta.mp4' },
            { id: 'Leche', text: 'Leche', videoPath: 'assets/videos/BebidasyAlimentos/Leche.mp4' },
            { id: 'Pan', text: 'Pan', videoPath: 'assets/videos/BebidasyAlimentos/Pan.mp4' },
            { id: 'Verdura', text: 'Verdura', videoPath: 'assets/videos/BebidasyAlimentos/Verdura.mp4' },
        ];
    }

    getAllItems() {
        return this.items;
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
} 