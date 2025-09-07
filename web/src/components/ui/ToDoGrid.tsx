'use client';

import { useState } from 'react';
import { Todo, TodoForm } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { cn } from '@/lib/utils';

interface ToDoGridProps {
  todos: Todo[];
  onAddTodo?: (todo: TodoForm) => void;
  onUpdateTodo?: (id: number, todo: Partial<TodoForm>) => void;
  onDeleteTodo?: (id: number) => void;
  className?: string;
}

export function ToDoGrid({ todos, onAddTodo, onUpdateTodo, onDeleteTodo, className }: ToDoGridProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodo, setNewTodo] = useState<TodoForm>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.title.trim()) {
      onAddTodo?.(newTodo);
      setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">To-Do List</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Todo
        </button>
      </div>

      {showAddForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter todo title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Todo
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {todos.map((todo) => (
          <Card
            key={todo.id}
            className={cn(
              'border-l-4',
              getPriorityColor(todo.attributes.priority),
              todo.attributes.completed && 'opacity-60'
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.attributes.completed}
                    onChange={(e) => onUpdateTodo?.(todo.id, { ...todo.attributes, completed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <CardTitle className={cn(
                    'text-base',
                    todo.attributes.completed && 'line-through text-gray-500'
                  )}>
                    {todo.attributes.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    todo.attributes.priority === 'high' && 'bg-red-100 text-red-800',
                    todo.attributes.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
                    todo.attributes.priority === 'low' && 'bg-green-100 text-green-800'
                  )}>
                    {getPriorityText(todo.attributes.priority)}
                  </span>
                  {onDeleteTodo && (
                    <button
                      onClick={() => onDeleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </CardHeader>
            {todo.attributes.description && (
              <CardContent>
                <p className="text-sm text-gray-600">{todo.attributes.description}</p>
              </CardContent>
            )}
            {todo.attributes.dueDate && (
              <CardContent>
                <p className="text-xs text-gray-500">
                  Due: {new Date(todo.attributes.dueDate).toLocaleDateString()}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {todos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No todos yet. Add one to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

