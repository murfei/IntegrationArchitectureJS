// inputs: { salesAmount, clientRanking, closeProbability }, socialRecord (ratings object)
function calculateBonus(salesRecord, socialPerformanceRecord, weights = {}) {
    // weights: { salesWeight, ratingWeight, socialWeight }
    //const w = Object.assign({ salesWeight: 0.8, socialWeight: 0.2 }, weights);
    const socialScoreWeight = 2;
    // Sum salesAmount weighted by clientRanking & closeProbability | clienRankings will be numbers 0-10
    let salesScore = 0;
    for (const s of salesRecord) {
        salesScore += s.items * (s.clientRanking || 1) * (50/s.closeProbability || 1);
    }

    let socialScore = 0;
    for (const s of socialPerformanceRecord){
        socialScore += s.supervisor * socialScoreWeight;
        socialScore += s.peer * socialScoreWeight;
    }
    //return sum of each part
    return salesScore + socialScore;
}

module.exports = { calculateBonus };