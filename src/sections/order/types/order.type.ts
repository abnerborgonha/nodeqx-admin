export type OrderHistoric = {
  id: string
  status: 'ON' | 'PAUSE' | 'EMERGENCY' | 'STOP' | 'OFF';
  counter: number
  createdAt: Date,
  updatedAt: Date
}

export type OrderProps = {
  id: string
  productOrderId: string
  name: string
  description: string
  status: 'ACTIVE' | 'CLOSED',
  historics?: OrderHistoric[],
  createdAt: string
  updatedAt: string
  batches?: any[]
};
