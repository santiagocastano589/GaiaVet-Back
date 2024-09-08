import { Sequelize } from 'sequelize';
import { Content } from "@google/generative-ai";
const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: 'mysql',
});

interface Part {
  text: string; 
}

export interface ChatEntry {
  role: "user" | "model";
  parts: Part[]; 
}


const GENERATION_CONFIG = {
  stopSequences: ["red"],
  maxOutputTokens: 400,
  temperature: 0.9,
  topP: 0.1,
  topK: 16,

  
};
const START_CHAT: ChatEntry[] = [
  {
    role: "user",
    parts: [
      { text: ` hola:Hola! bienvenido  gaiavet esperamos tengas una experiencia agradable
        
        Nombre de la Empresa: Gaiavet
  
      Misión: La mision de Gaiavet, es automatizar y mejorar el sistema de las veterinarias al momento de crear citas y/o vender sus productos
      
      Visión: Gaiavet quiere ser la mejor opcion para las veterinarias por lo cual creamos un sistema afecte positivamente diversos aspectos operativos, administrativos y de atención al cliente, permitiendo un manejo más eficiente y eficaz de los recursos y servicios. ​
      
      Fecha de Creación: Gaiavet fue creado en 2024 por unos jovenes aspirantes a ser desarrolladores de software.
      
      Descripción General:
      GaiaVet se crea para ampliar el alcance de una veterinaria local mediante un sistema personalizado diseñado para satisfacer sus necesidades específicas. Actualmente, nuestro cliente enfrenta desafíos significativos en la gestión eficiente de citas para tratamientos como consultas médicas, baños y cortes de pelo para mascotas, entre otros. Además, existe la necesidad de establecer un Marketplace integrado para ampliar la distribución de productos y facilitar métodos de pago como tarjetas de crédito, débito y transferencias PSE.

      La solución propuesta por GaiaVet incluye un sistema optimizado de gestión de citas que permitirá programar y administrar citas de manera eficiente, garantizando una experiencia sin problemas para los clientes y el personal. Asimismo, se implementará un robusto sistema de inventario en tiempo real para controlar los productos disponibles y gestionar su distribución de manera efectiva.

      Además, GaiaVet contará con un Marketplace integrado donde los clientes podrán acceder fácilmente a una variedad de productos para mascotas y realizar pagos de forma segura. Se habilitará un sistema de comentarios y reseñas para que los usuarios compartan sus experiencias y recomendaciones, promoviendo la interacción y retroalimentación positiva.

      En resumen, GaiaVet se compromete a ofrecer un control y manejo superiores de las citas y el inventario, junto con una experiencia de compra en línea conveniente y segura, para mejorar significativamente la operación y el alcance de nuestra veterinaria cliente.
      
     
      ` }
      
      
    ]
  },
  {
    role: "model",
    parts: [{ text: "Genial empresa!" }]
  }
];



export { START_CHAT, GENERATION_CONFIG};

export default sequelize;
