const Reading = require("../models/Reading");
const moment = require("moment");
const sanitize = require("mongo-sanitize");


// Obtener todas las lecturas de un sensor
const getReadingsBySensor = async (req, res) => {
    try {
        let query;

        try {
            query = JSON.parse(req.params.sensorId);
        } catch {
            query = { sensorId: req.params.sensorId };
        }

        // Sanitiza la consulta antes de ejecutarla en MongoDB
        query = sanitize(query);

        // Si sensorId es un objeto vacío después de sanitizar, ignoramos la consulta
        if (typeof query.sensorId === "object" && Object.keys(query.sensorId).length === 0) {
            console.log(query);
            return res.status(400).json({ msg: "Consulta inválida" });

        }

        console.log(query); //Verifica la consulta en consola

        const readings = await Reading.find(query);

        if (!readings.length) {
            return res.status(404).json({ msg: "No se encontraron lecturas para este sensor" });
        }

        res.status(200).json(readings);
    } catch (err) {
        res.status(500).json({ msg: "Error al obtener las lecturas", error: err.message });
    }
};

// Crear una nueva lectura
const createReading = async (req, res) => {
    try {
        const { sensorId, value, unit } = req.body;
        /*
            const sensorId = req.body.sensorId;
            const value = req.body.value;
            const unit = req.body.unit;
            */

        if (!sensorId || !value || !unit) {
            return res
                .status(400)
                .json({ msg: "Faltan datos  sensorId, value o unit" });
        }

        const reading = new Reading({
            sensorId,
            value,
            unit,
        });

        await reading.save();
        res.status(201).json({ msg: "Lectura guardada correctamente", reading });
    } catch (err) {
        res
            .status(500)
            .json({ msg: "Error al guardar la lectura", error: err.message });
    }
};


const deleteReadingsBySensor = async (req, res) => {
    try {
        let query;

        try {
            query = JSON.parse(req.params.sensorId);
        } catch {
            query = { sensorId: req.params.sensorId };
        }

        //Sanitiza la consulta antes de ejecutarla en MongoDB
        query = sanitize(query);

        //  Si sensorId es un objeto vacío después de sanitizar, ignoramos la consulta
        if (typeof query.sensorId === "object" && Object.keys(query.sensorId).length === 0) {
            return res.status(400).json({ msg: "Consulta inválida" });
        }

        console.log(query); // Verifica la consulta en consola

        const result = await Reading.deleteMany(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: "No se encontraron lecturas para eliminar" });
        }

        res.status(200).json({ msg: "Todas las lecturas del sensor fueron eliminadas" });
    } catch (err) {
        res.status(500).json({ msg: "Error al eliminar las lecturas", error: err.message });
    }
};

// Obtener lecturas de un sensor en un rango de fechas
const getReadingsByTimeRange = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { start, end } = req.query;

        console.log("Start recibido:", start);
        console.log("End recibido:", end);

        if (!start || !end) {
            return res.status(400).json({ msg: "steart y endformato DD-MM-YYYY" });
        }
        const startDate = moment(start, "DD-MM-YYYY").startOf('day').toDate();
        const endDate = moment(end, "DD-MM-YYYY").endOf('day').toDate();

        console.log("Start convertido:", startDate);
        console.log("End convertido:", endDate);

        const filter = {
            sensorId: sensorId,
            timestamp: { $gte: startDate, $lte: endDate }
        };

        console.log("Filtro aplicado:", filter);

        const readings = await Reading.find(filter);

        if (readings.length === 0) {
            return res.status(404).json({ msg: "No se encontraron lecturas" });
        }

        res.status(200).json(readings);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ msg: "Error ", error: err.message });
    }

};
module.exports = {
    getReadingsBySensor,
    createReading,
    deleteReadingsBySensor,
    getReadingsByTimeRange
};

