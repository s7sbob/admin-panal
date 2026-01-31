const BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Login to the backend for Admin Panel
 */
export async function login(phone: string, password: string) {
  const url = `${BASE_URL}/Login?PhoneNo=${encodeURIComponent(phone)}&Password=${encodeURIComponent(password)}`;
  
  console.log('🔵 Login Request:', { url, phone });
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
    });
    
    console.log('🔵 Response Status:', response.status, response.ok);
    
    const textResponse = await response.text();
    console.log('🔵 Response Text:', textResponse);
    
    if (!textResponse || textResponse === 'false' || textResponse.trim() === 'false') {
      console.log('❌ Login returned false');
      return false;
    }
    
    try {
      const data = JSON.parse(textResponse);
      console.log('✅ Parsed JSON:', data);
      return data;
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error('Invalid response format from server');
    }
    
  } catch (error: any) {
    console.error('❌ Network Error:', error);
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
  
  // Handle the API response structure
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
