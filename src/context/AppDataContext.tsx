import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Task, Vendor, VendorAssignment, Approval, BudgetItem, Notification, ChatMessage } from '../types';
import pb from '../pocketbase';
import chatMessagesData from '../data/chatMessages.json';

interface AppDataContextType {
  tasks: Task[];
  vendors: Vendor[];
  vendorAssignments: VendorAssignment[];
  approvals: Approval[];
  budgetItems: BudgetItem[];
  notifications: Notification[];
  chatMessages: ChatMessage[];
  getTasksByEvent: (eventId: string) => Task[];
  getApprovalsByEvent: (eventId: string) => Approval[];
  getVendorsByEvent: (eventId: string) => (Vendor & { assignment: VendorAssignment | undefined })[];
  getBudgetByEvent: (eventId: string) => BudgetItem[];
  getVendorById: (id: string) => Vendor | undefined;
  updateTaskStatus: (taskId: string, status: string) => void;
  updateApprovalStatus: (approvalId: string, status: string, comments?: string) => void;
  markNotificationRead: (notificationId: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  getUnreadNotifications: () => Notification[];
  createTask: (task: Partial<Task>) => Promise<void>;
  refetchTasks: () => void;
  refetchVendorAssignments: () => void;
  refetchBudgetItems: () => void;
  refetchApprovals: () => void;
}

const AppDataContext = createContext<AppDataContextType>({} as AppDataContextType);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [vendorAssignments, setVendorAssignments] = useState<VendorAssignment[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(chatMessagesData as ChatMessage[]);

  const fetchTasks = useCallback(async () => {
    try {
      const records = await pb.collection('tasks').getFullList();
      const mapped = records.map((r) => ({
        id: r.id,
        event_id: r.event_id,
        organization_id: r.organization_id,
        title: r.title,
        description: r.description,
        status: r.status,
        priority: r.priority,
        due_date: r.due_date,
        assigned_to: r.assigned_to,
        vendor_id: r.vendor_id,
        completed_at: r.completed_at,
        created_at: r.created,
      })) as Task[];
      setTasks(mapped);
      console.log('Tasks fetched:', mapped.length);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    try {
      const records = await pb.collection('vendors').getFullList();
      const mapped = records.map((r) => ({
        id: r.id,
        organization_id: r.organization_id,
        name: r.name,
        category: r.category,
        phone: r.phone,
        email: r.email,
        city: r.city,
        description: r.description,
        average_rating: r.average_rating,
        total_reviews: r.total_reviews,
        is_verified: r.is_verified,
        is_active: r.is_active,
      })) as Vendor[];
      setVendors(mapped);
      console.log('Vendors fetched:', mapped.length);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    }
  }, []);

  const fetchVendorAssignments = useCallback(async () => {
    try {
      const records = await pb.collection('vendor_assignments').getFullList();
      const mapped = records.map((r) => ({
        id: r.id,
        event_id: r.event_id,
        vendor_id: r.vendor_id,
        status: r.status,
        notes: r.notes,
      })) as VendorAssignment[];
      setVendorAssignments(mapped);
      console.log('Vendor assignments fetched:', mapped.length);
    } catch (err) {
      console.error('Failed to fetch vendor assignments:', err);
    }
  }, []);

  const fetchBudgetItems = useCallback(async () => {
    try {
      const records = await pb.collection('budget_items').getFullList();
      const mapped = records.map((r) => ({
        id: r.id,
        event_id: r.event_id,
        organization_id: r.organization_id,
        category: r.category,
        vendor_id: r.vendor_id,
        allocated_amount: r.allocated_amount,
        spent_amount: r.spent_amount,
        status: r.status,
        notes: r.notes,
      })) as BudgetItem[];
      setBudgetItems(mapped);
      console.log('Budget items fetched:', mapped.length);
    } catch (err) {
      console.error('Failed to fetch budget items:', err);
    }
  }, []);

  const fetchApprovals = useCallback(async () => {
    try {
      const records = await pb.collection('approvals').getFullList();
      const mapped = records.map((r) => ({
        id: r.id,
        event_id: r.event_id,
        organization_id: r.organization_id,
        title: r.title,
        description: r.description,
        requested_by: r.requested_by,
        status: r.status,
        approval_date: r.approval_date,
        approval_comments: r.approval_comments,
        amount: r.amount,
        created_at: r.created,
      })) as Approval[];
      setApprovals(mapped);
      console.log('Approvals fetched:', mapped.length);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const records = await pb.collection('notifications').getFullList();
      const mapped = records.map((r) => ({
        id: r.id,
        event_id: r.event_id,
        organization_id: r.organization_id,
        title: r.title,
        body: r.body,
        type: r.type,
        is_read: r.is_read,
        user_id: r.user_id,
        created_at: r.created,
      })) as Notification[];
      setNotifications(mapped);
      console.log('Notifications fetched:', mapped.length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    if (pb.authStore.isValid) {
      fetchTasks();
      fetchVendors();
      fetchVendorAssignments();
      fetchBudgetItems();
      fetchApprovals();
      fetchNotifications();
    }
    pb.authStore.onChange(() => {
      if (pb.authStore.isValid) {
        fetchTasks();
        fetchVendors();
        fetchVendorAssignments();
        fetchBudgetItems();
        fetchApprovals();
        fetchNotifications();
      }
    });
  }, [fetchTasks, fetchVendors, fetchVendorAssignments, fetchBudgetItems, fetchApprovals, fetchNotifications]);

  const getTasksByEvent = useCallback(
    (eventId: string) => tasks.filter((t) => t.event_id === eventId),
    [tasks]
  );

  const getApprovalsByEvent = useCallback(
    (eventId: string) => approvals.filter((a) => a.event_id === eventId),
    [approvals]
  );

  const getVendorsByEvent = useCallback(
    (eventId: string) => {
      const assignments = vendorAssignments.filter((va) => va.event_id === eventId);
      return vendors
        .filter((v) => assignments.some((a) => a.vendor_id === v.id))
        .map((v) => ({
          ...v,
          assignment: assignments.find((a) => a.vendor_id === v.id),
        }));
    },
    [vendors, vendorAssignments]
  );

  const getBudgetByEvent = useCallback(
    (eventId: string) => budgetItems.filter((b) => b.event_id === eventId),
    [budgetItems]
  );

  const getVendorById = useCallback(
    (id: string) => vendors.find((v) => v.id === id),
    [vendors]
  );

  const updateTaskStatus = useCallback(async (taskId: string, status: string) => {
    try {
      await pb.collection('tasks').update(taskId, {
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: status as Task['status'], completed_at: status === 'completed' ? new Date().toISOString() : t.completed_at }
            : t
        )
      );
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }, []);

  const createTask = useCallback(async (task: Partial<Task>) => {
    try {
      await pb.collection('tasks').create(task);
      await fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }, [fetchTasks]);

  const updateApprovalStatus = useCallback(async (approvalId: string, status: string, comments?: string) => {
    try {
      await pb.collection('approvals').update(approvalId, {
        status,
        approval_date: new Date().toISOString(),
        approval_comments: comments,
      });
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId
            ? { ...a, status: status as Approval['status'], approval_date: new Date().toISOString(), approval_comments: comments }
            : a
        )
      );
    } catch (err) {
      console.error('Failed to update approval:', err);
    }
  }, []);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      await pb.collection('notifications').update(notificationId, { is_read: true });
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const getUnreadNotifications = useCallback(
    () => notifications.filter((n) => !n.is_read),
    [notifications]
  );

  return (
    <AppDataContext.Provider
      value={{
        tasks, vendors, vendorAssignments, approvals, budgetItems, notifications, chatMessages,
        getTasksByEvent, getApprovalsByEvent, getVendorsByEvent, getBudgetByEvent, getVendorById,
        updateTaskStatus, updateApprovalStatus, markNotificationRead, addChatMessage, getUnreadNotifications,
        createTask, refetchTasks: fetchTasks,
        createTask, refetchTasks: fetchTasks,
        refetchBudgetItems: fetchBudgetItems,
        refetchApprovals: fetchApprovals,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export const useAppData = () => useContext(AppDataContext);