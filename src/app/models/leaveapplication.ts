export class LeaveApplication {
  id?: number;
  applicantId: number = 0;
  managerId: number = 0;
  startDate: Date = new Date();
  endDate: Date = new Date();
  returnDate: Date = new Date();
  numberOfDays: number = 0;
  generalComments?: string;
}
