import dayjs from 'dayjs';
import { models, sequelize } from '../../../models';
import { Op } from "sequelize";

export default defineEventHandler(async (event) => {
    const slug = event.context.params?.slug;
    const market = slug?.split("/")[0].toUpperCase();
    const stockCode = slug?.split("/")[1];
    let stockData: Record<string, unknown> = {};

    stockData.stockInfo = await models.stockList.findOne({
        where : {
            stockCode
        }
    });

    stockData.stockPriceHistory = await models.stockPriceHistory.findAll({
        where : {
            [Op.and] : [
                {market}, 
                {stockCode},
                {regDate : {
                    [Op.between] : [dayjs().subtract(3, 'day').toDate(), dayjs().toDate()]
                }}
            ]
        },
        order : [
            ['regDate', 'DESC']
        ]
    });

    stockData.weightInfo = await models.etfStockList.findAll({
        attributes: [
            'market', 
            'etfStockCode', 
            'stockCode',
            [sequelize.fn('CONCAT', sequelize.fn('FORMAT', sequelize.literal('etf_percent * 100'), 2), '%'), 'etfPercent']
        ],
        where : {
            market, 
            stockCode
        },
        include : [{ 
            model: models.etfList,
            as: "etfList",
            attributes: ['etfName', 'companyName', 'tradingLot', 'trustFeeRate', 'stdPdno'],
            required: true
        }]
    });

    return stockData;
});
