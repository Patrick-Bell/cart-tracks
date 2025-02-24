export const findBestWorker = (workers) => {
    // Extract data for each worker with margin calculation
    const workerData = workers.map(worker => {
      const totalAmount = worker.carts.reduce((sum, cart) => sum + cart.worker_total, 0);
      const totalExpected = worker.carts.reduce((sum, cart) => sum + cart.total_value, 0);
      const margin = totalExpected > 0 ? (totalAmount / totalExpected) * 100 : 0;
  
      return {
        name: worker.name,
        amount: totalAmount,
        expected: totalExpected,
        margin: margin
      };
    });
  
    const bestWorker = workerData.sort((a, b) => b.margin - a.margin)[0];
  
  
    return bestWorker;
  };
  