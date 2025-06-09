"use client";
import { useRouter } from "next/navigation";
import { handleDeleteRoutine } from "@/server-actions/RoutineServerActions";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@nextui-org/dropdown";
import {
  IconEdit,
  IconInfoCircle,
  IconMenu2,
  IconTrash,
  IconShare,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function RoutineMenu({ routineId }: { routineId: string }) {
  const router = useRouter();

  const handleDelete = async (routineId: string) => {
    const response = await handleDeleteRoutine(routineId);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleShare = async (routineId: string) => {
    try {
      // Generate a unique share ID if it doesn't exist
      const response = await fetch(`/api/routines/${routineId}/share`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const { shareId } = await response.json();
        const shareUrl = `${window.location.origin}/import-routine/${shareId}`;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
      } else {
        toast.error("Failed to generate share link");
      }
    } catch (error) {
      console.error('Error sharing routine:', error);
      toast.error("Failed to share routine");
    }
  };

  const handleAction = (key: string, routineId: string) => {
    if (key === "delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this routine?",
      );
      if (confirmDelete) {
        handleDelete(routineId);
      }
    } else if (key === "edit") {
      router.push(`/edit-routine/step-1?id=${routineId}`);
    } else if (key === "share") {
      handleShare(routineId);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="shrink-0" aria-label="Routine actions">
          <IconMenu2 className="text-black dark:text-primary" size={22} />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        topContent={
          <h4 className="text-zinc-500 uppercase font-semibold text-xs px-2 pt-2 pb-[10px]">
            Routine Actions
          </h4>
        }
        onAction={(key) => handleAction(String(key), routineId)}
      >
        <DropdownSection showDivider>
          <DropdownItem startContent={<IconEdit size={20} />} key="edit">
            Edit
          </DropdownItem>
          <DropdownItem startContent={<IconShare size={20} />} key="share">
            Share Routine
          </DropdownItem>
        </DropdownSection>

        <DropdownItem
          startContent={<IconTrash size={20} />}
          key="delete"
          className="text-danger"
          color="danger"
        >
          Delete Routine
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}