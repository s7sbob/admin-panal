const BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Login to the backend for Admin Panel
 */
export async function login(phone: string, password: string) {
  const url = `${BASE_URL}/Login?PhoneNo=${encodeURIComponent(phone)}&Password=${encodeURIComponent(password)}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
    });
    
    const textResponse = await response.text();
    
    if (!textResponse || textResponse === 'false' || textResponse.trim() === 'false') {
      return false;
    }
    
    try {
      const data = JSON.parse(textResponse);
      return data;
    } catch (parseError) {
      throw new Error('Invalid response format from server');
    }
    
  } catch (error: any) {
    throw new Error(error.message || 'Network error');
  }
}

/**
 * Helper to build common headers for authorised API calls.
 */
function buildAuthHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// =====================================================
// TENANTS APIs
// =====================================================

/**
 * Fetch tenants list.
 */
export async function getTenants(token: string) {
  const response = await fetch(`${BASE_URL}/getTenants?AgentId`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch tenants');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch tenants');
}

/**
 * Add a tenant.
 */
export async function addTenant(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/addTenant`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to add tenant');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to add tenant');
}

/**
 * Update a tenant.
 */
export async function updateTenant(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/updateTenant`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to update tenant');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to update tenant');
}

/**
 * Delete a tenant.
 */
export async function deleteTenant(tenantId: string, token: string) {
  const response = await fetch(`${BASE_URL}/deleteTenant?TenantID=${encodeURIComponent(tenantId)}`, {
    method: 'DELETE',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to delete tenant');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to delete tenant');
}

/**
 * Get deleted tenants list.
 */
export async function getDeletedTenants(token: string) {
  const response = await fetch(`${BASE_URL}/getDeletedTenants`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch deleted tenants');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch deleted tenants');
}

// =====================================================
// BRANCHES APIs
// =====================================================

/**
 * Fetch branches list.
 */
export async function getBranches(token: string) {
  const response = await fetch(`${BASE_URL}/GetBranchs`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch branches');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch branches');
}

/**
 * Get a specific branch by ID.
 */
export async function getBranch(branchId: string, token: string) {
  const response = await fetch(`${BASE_URL}/getBranch?BranchId=${encodeURIComponent(branchId)}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch branch');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch branch');
}

/**
 * Add a branch.
 */
export async function addBranch(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/addBranch`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to add branch');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to add branch');
}

/**
 * Update a branch.
 */
export async function updateBranch(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/updateBranch`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to update branch');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to update branch');
}

// =====================================================
// AGENTS APIs
// =====================================================

/**
 * Fetch agents list.
 */
export async function getAgents(token: string) {
  const response = await fetch(`${BASE_URL}/getAgents`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch agents');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch agents');
}

/**
 * Add an agent.
 */
export async function addAgent(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/addAgent`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to add agent');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to add agent');
}

/**
 * Update an agent.
 */
export async function updateAgent(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/updateAgent`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to update agent');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to update agent');
}

/**
 * Get a specific agent by ID.
 */
export async function getAgent(agentId: string, token: string) {
  const response = await fetch(`${BASE_URL}/getAgent?AgentID=${encodeURIComponent(agentId)}`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch agent');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch agent');
}

// =====================================================
// USERS APIs
// =====================================================

/**
 * Get all users by agent ID
 */
export async function getAllUsersByAgentId(token: string) {
  const response = await fetch(`${BASE_URL}/getAllUsersByAgentId`, {
    method: 'GET',
    headers: buildAuthHeaders(token),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch users');
  }
  const result = await response.json();
  
  if (result.isvalid && result.data) {
    return result.data;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to fetch users');
}

/**
 * Register a new user
 */
export async function registerUser(data: Record<string, any>, token: string) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: buildAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to register user');
  }
  const result = await response.json();
  
  if (result.isvalid) {
    return result;
  }
  
  throw new Error(result.errors?.join(', ') || 'Failed to register user');
}
