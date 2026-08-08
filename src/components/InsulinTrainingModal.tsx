import { Dialog, DialogContent } from "@/components/ui/dialog";
import InsulinTrainingSection from "./InsulinTrainingSection";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InsulinTrainingModal = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 bg-background">
        <div className="-my-8">
          <InsulinTrainingSection />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsulinTrainingModal;
