# Pattern: Atomic Stock Locking & Negative Balance Prevention

All stock operations (Sales Challan confirmation, Stock Out, Stock Transfer) must execute inside a Prisma interactive transaction (`prisma.$transaction`):

1. **Query**: Fetch current inventory balance for target `productId` and `warehouseId`.
2. **Check**: Verify `currentQuantity >= requestedQuantity`. If insufficient, throw a `StockValidationError`.
3. **Update**: Deduct stock quantity atomically.
4. **Log**: Record entry in `stock_movements` table.
5. **Notify**: If new quantity <= `minStockAlert`, dispatch low stock notification.
