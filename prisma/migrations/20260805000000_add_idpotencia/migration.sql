-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "idpotencia" TEXT;

-- AlterTable
ALTER TABLE "PlanPayment" ADD COLUMN     "idpotencia" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pedido_idpotencia_key" ON "Pedido"("idpotencia");

-- CreateIndex
CREATE UNIQUE INDEX "PlanPayment_idpotencia_key" ON "PlanPayment"("idpotencia");
