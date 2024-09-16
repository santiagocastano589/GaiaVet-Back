"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("./models/userModel"));
const connection_1 = __importDefault(require("./db/connection"));
const cors_1 = __importDefault(require("cors"));
const empleadoModel_1 = __importDefault(require("./models/empleadoModel"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const adminModel_1 = __importDefault(require("./models/adminModel"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const petRoutes_1 = __importDefault(require("./routes/petRoutes"));
const petModel_1 = __importDefault(require("./models/petModel"));
const employeeRoutes_1 = __importDefault(require("./routes/employeeRoutes"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const productoModel_1 = __importDefault(require("./models/productoModel"));
const citaRoutes_1 = __importDefault(require("./routes/citaRoutes"));
const citaModel_1 = __importDefault(require("./models/citaModel"));
const sendEmailRoutes_1 = __importDefault(require("./routes/sendEmailRoutes"));
const reviewsRoutes_1 = __importDefault(require("./routes/reviewsRoutes"));
const reviewsModel_1 = __importDefault(require("./models/reviewsModel"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
userModel_1.default.initModel();
empleadoModel_1.default.initModel();
adminModel_1.default.initModel();
petModel_1.default.initModel();
productoModel_1.default.initModel();
citaModel_1.default.initModel();
reviewsModel_1.default.initModel();
app.use('/', userRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/', adminRoutes_1.default);
app.use('/', petRoutes_1.default);
app.use('/', productoRoutes_1.default);
app.use('/', employeeRoutes_1.default);
app.use('/', citaRoutes_1.default);
app.use('/', sendEmailRoutes_1.default);
app.use('/', reviewsRoutes_1.default);
app.listen(port, () => {
    function testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield connection_1.default.authenticate();
                console.log('Conexión establecida correctamente.');
            }
            catch (error) {
                console.error('No se pudo conectar a la base de datos:', error);
            }
        });
    }
    testConnection();
    console.log(`Server running on port ${port}`);
});
