/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Filter,
  User,
  FolderKanban,
  Flag,
} from 'lucide-react';
import { AgencyTask, Lead, Project } from '../types';
import { Modal } from '../components/Modal';
import { deleteTask, saveTask, toggleTaskStatus } from '../services/storage';
import { formatDate } from '../utils/formatters';

interface TasksViewProps {
  tasks: AgencyTask[];
  leads: Lead[];
  projects: Project[];
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, leads, projects }) => {
  const [filter, setFilter] = useState<'all' | 'today' | 'overdue' | 'high' | 'completed'>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('11:00 AM');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [relatedClientName, setRelatedClientName] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'today') return t.dueDate === todayStr && t.status === 'Pending';
    if (filter === 'overdue') return t.dueDate < todayStr && t.status === 'Pending';
    if (filter === 'high') return t.priority === 'High' && t.status === 'Pending';
    if (filter === 'completed') return t.status === 'Completed';
    return true;
  });

  const overdueCount = tasks.filter((t) => t.dueDate < todayStr && t.status === 'Pending').length;
  const todayCount = tasks.filter((t) => t.dueDate === todayStr && t.status === 'Pending').length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: AgencyTask = {
      id: 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate,
      dueTime: dueTime.trim() || undefined,
      priority,
      relatedClientName: relatedClientName.trim() || undefined,
      status: 'Pending',
      createdAt: todayStr,
    };

    saveTask(newTask);
    setIsAddOpen(false);
    setTitle('');
    setDescription('');
    setRelatedClientName('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-amber-400" />
            Task & Reminder Manager
          </h2>
          <p className="text-xs text-slate-400">
            Never miss a client call, proposal follow-up, or design deliverable deadline.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Add New Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === 'today'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          Due Today ({todayCount})
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === 'overdue'
              ? 'bg-rose-500 text-white font-bold'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          Overdue ({overdueCount})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === 'high'
              ? 'bg-purple-500 text-white font-bold'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          High Priority
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'border border-slate-800 bg-[#0b1224] text-slate-400 hover:text-white'
          }`}
        >
          Completed ({tasks.filter((t) => t.status === 'Completed').length})
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-[#0b1224] p-12 text-center text-xs text-slate-400">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 opacity-50 mb-2" />
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isOverdue = task.dueDate < todayStr && !isCompleted;
            const isToday = task.dueDate === todayStr && !isCompleted;

            return (
              <div
                key={task.id}
                className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-slate-800/60 bg-slate-900/30 opacity-75'
                    : isOverdue
                    ? 'border-rose-500/40 bg-[#160d16]'
                    : isToday
                    ? 'border-amber-500/30 bg-[#141209]'
                    : 'border-slate-800 bg-[#0b1224]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="mt-1 h-4 w-4 rounded-sm border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
                  />

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </h4>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          task.priority === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority} Priority
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                        {task.dueTime && <span>at {task.dueTime}</span>}
                      </span>

                      {task.relatedClientName && (
                        <span className="flex items-center gap-1 text-cyan-400/90 font-medium">
                          <User className="h-3 w-3" />
                          <span>Client: {task.relatedClientName}</span>
                        </span>
                      )}

                      {isOverdue && (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Overdue
                        </span>
                      )}

                      {isToday && (
                        <span className="text-amber-400 font-bold">
                          ⚡ Due Today
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    {isCompleted ? 'Mark Pending' : 'Mark Complete'}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/15 p-2 text-rose-400 hover:bg-rose-500/25"
                    title="Delete Task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Create New Agency Task"
          subtitle="Set reminders, client follow-ups and development milestones"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Task Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Call Sachin Patil for advance confirmation"
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Task Description / Notes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key points to discuss or specific action needed..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Due Time
                </label>
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  placeholder="e.g. 04:00 PM"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Link to Client / Lead
              </label>
              <select
                value={relatedClientName}
                onChange={(e) => setRelatedClientName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white"
              >
                <option value="">None / Internal Agency Task</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name} ({l.businessName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all"
              >
                Save Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
