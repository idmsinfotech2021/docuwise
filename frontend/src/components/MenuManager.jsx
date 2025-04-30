// frontend/src/pages/MenuManager.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../axiosConfig';

const MenuManager = () => {
  const [roles] = useState(['admin', 'user', 'manager']);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({ label: '', icon: '', path: '', type: 'link', status: 'Active', sequence: 0 });

  const [editIndex, setEditIndex] = useState(null);

  const [expandedMenus, setExpandedMenus] = useState([]);
  const [newSubMenu, setNewSubMenu] = useState({ label: '', path: '', icon: '', status: 'Active', sequence: 0 });

  const [editingSubMenuIndex, setEditingSubMenuIndex] = useState(null);
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, [selectedRole]);

  const fetchMenus = async () => {
    try {
      const res = await axiosInstance.get(`/menus/${selectedRole}`);
      setMenus(res.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const handleAddMenu = async () => {
    try {
      await axiosInstance.post(`/menus/${selectedRole}/add`, { newMenuItem: newMenu });
      setNewMenu({ label: '', icon: '', path: '', type: 'link' });
      fetchMenus();
    } catch (error) {
      console.error('Error adding menu:', error);
    }
  };

  const handleEditMenu = async () => {
    try {
      await axiosInstance.put(`/menus/${selectedRole}/edit`, { index: editIndex, updatedMenuItem: newMenu });
      setNewMenu({ label: '', icon: '', path: '', type: 'link' });
      setEditIndex(null);
      fetchMenus();
    } catch (error) {
      console.error('Error editing menu:', error);
    }
  };

  const handleDeleteMenu = async (index) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        await axiosInstance.delete(`/menus/${selectedRole}/delete`, { data: { index } });
        fetchMenus();
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  const openEditModal = (menu, index) => {
    setNewMenu(menu);
    setEditIndex(index);
  };

  const toggleExpand = (index) => {
    setExpandedMenus(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSubMenuSave = async (menuIdx) => {
    try {
      if (editingSubMenuIndex !== null) {
        await axiosInstance.put(`/menus/${selectedRole}/${menuIdx}/submenu/edit/${editingSubMenuIndex}`, newSubMenu);
      } else {
        await axiosInstance.post(`/menus/${selectedRole}/${menuIdx}/submenu/add`, newSubMenu);
      }
      setNewSubMenu({ label: '', path: '', icon: '' });
      setEditingSubMenuIndex(null);
      setSelectedMenuIndex(null);
      fetchMenus();
    } catch (error) {
      console.error('Error saving submenu:', error);
    }
  };

  const handleSubMenuEdit = (menuIdx, subIdx, subMenu) => {
    setSelectedMenuIndex(menuIdx);
    setEditingSubMenuIndex(subIdx);
    setNewSubMenu(subMenu);
  };

  const handleSubMenuDelete = async (menuIdx, subIdx) => {
    if (window.confirm('Are you sure to delete this SubMenu?')) {
      try {
        await axiosInstance.delete(`/menus/${selectedRole}/${menuIdx}/submenu/delete/${subIdx}`);
        fetchMenus();
      } catch (error) {
        console.error('Error deleting submenu:', error);
      }
    }
  };

  return (
    <div className="container">
      <h2>Menu Management</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Role:&nbsp;</label>
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          {roles.map((role, idx) => (
            <option key={idx} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Label"
          value={newMenu.label}
          onChange={(e) => setNewMenu({ ...newMenu, label: e.target.value })}
        />
        <input
          type="text"
          placeholder="Icon"
          value={newMenu.icon}
          onChange={(e) => setNewMenu({ ...newMenu, icon: e.target.value })}
        />
        <input
          type="text"
          placeholder="Path"
          value={newMenu.path}
          onChange={(e) => setNewMenu({ ...newMenu, path: e.target.value })}
        />
        <select
          value={newMenu.type}
          onChange={(e) => setNewMenu({ ...newMenu, type: e.target.value })}
        >
          <option value="link">Link</option>
          <option value="group">Group</option>
        </select>
        <select value={newMenu.status} onChange={(e) => setNewMenu({ ...newMenu, status: e.target.value })}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <input
          type="number"
          placeholder="Sequence"
          value={newMenu.sequence}
          onChange={(e) => setNewMenu({ ...newMenu, sequence: parseInt(e.target.value) || 0 })}
        />


        {editIndex === null ? (
          <button onClick={handleAddMenu}>Add Menu</button>
        ) : (
          <button onClick={handleEditMenu}>Update Menu</button>
        )}
      </div>

      <table border="1" width="100%" cellPadding="10">
        <thead>
          <tr>
            <th>Label</th>
            <th>Icon</th>
            <th>Path</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((menu, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{menu.label}</td>
                <td>{menu.icon}</td>
                <td>{menu.path}</td>
                <td>{menu.type}</td>
                <td>
                  <button onClick={() => openEditModal(menu, index)}>Edit</button>
                  <button onClick={() => handleDeleteMenu(index)}>Delete</button>
                  {menu.type === 'group' && (
                    <button onClick={() => toggleExpand(index)}>
                      {expandedMenus.includes(index) ? 'Collapse' : 'Expand'}
                    </button>
                  )}
                </td>
              </tr>

              {expandedMenus.includes(index) && menu.subMenus && (
                <>
                  {menu.subMenus.map((sub, subIdx) => (
                    <tr key={subIdx} style={{ backgroundColor: '#f9f9f9' }}>
                      <td style={{ paddingLeft: '40px' }}>➡ {sub.label}</td>
                      <td>{sub.icon}</td>
                      <td>{sub.path}</td>
                      <td>
                        <select value={newSubMenu.status} onChange={(e) => setNewSubMenu({ ...newSubMenu, status: e.target.value })}>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Sequence"
                          value={newSubMenu.sequence}
                          onChange={(e) => setNewSubMenu({ ...newSubMenu, sequence: parseInt(e.target.value) || 0 })}
                        />
                      </td>
                      <td>SubMenu</td>
                      <td>
                        <button onClick={() => handleSubMenuEdit(index, subIdx, sub)}>Edit</button>
                        <button onClick={() => handleSubMenuDelete(index, subIdx)}>Delete</button>
                      </td>
                    </tr>
                  ))}

                  {/* Add/Edit SubMenu Form */}
                  <tr>
                    <td colSpan="5" style={{ paddingLeft: '40px' }}>
                      <input
                        type="text"
                        placeholder="SubMenu Label"
                        value={newSubMenu.label}
                        onChange={(e) => setNewSubMenu({ ...newSubMenu, label: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="SubMenu Path"
                        value={newSubMenu.path}
                        onChange={(e) => setNewSubMenu({ ...newSubMenu, path: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="SubMenu Icon"
                        value={newSubMenu.icon}
                        onChange={(e) => setNewSubMenu({ ...newSubMenu, icon: e.target.value })}
                      />
                      <button onClick={() => handleSubMenuSave(index)}>
                        {editingSubMenuIndex !== null ? 'Update SubMenu' : 'Add SubMenu'}
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManager;
