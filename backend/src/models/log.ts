import mongoose from 'mongoose';
import { TLogFile } from 'types';

interface ILog {
  title: string;
  logFiles?: TLogFile[];
  analizedDescription: string;
  noteFromUser?: string;
}

const fileLogSchema = new mongoose.Schema<TLogFile>({
  fileName: {
    type: String,
  },
  originalName: {
    type: String,
  },
});

const observerLogSchema = new mongoose.Schema<ILog>({
  title: {
    type: String,
    required: true,
  },
  logFiles: [fileLogSchema],
  analizedDescription: {
    type: String,
  },
  noteFromUser: {
    type: String,
  },
});

export default mongoose.model<ILog>('ObserverLog', observerLogSchema);
