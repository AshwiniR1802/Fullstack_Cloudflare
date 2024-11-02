export default {
	async fetch(request, env) {
	  const url = new URL(request.url);
  
	  // Handle CORS preflight OPTIONS request
	  if (request.method === 'OPTIONS') {
		return handleOptions();
	  }
  
	  try {
		if (request.method === 'POST' && url.pathname === '/api/create-notification') {
		  return await handleCreateNotification(request, env);
		} else if (request.method === 'GET' && url.pathname === '/api/get-notifications') {
		  return await handleGetNotifications(env);
		} else {
		  return new Response('Not Found', {
			status: 404,
			headers: createCORSHeaders(),
		  });
		}
	  } catch (error) {
		console.error('Error in fetch handler:', error);
		return new Response(JSON.stringify({ error: error.message }), {
		  status: 500,
		  headers: createCORSHeaders(),
		});
	  }
	},
  };
  
  // CORS handling for OPTIONS requests
  function handleOptions() {
	return new Response(null, {
	  status: 204,
	  headers: createCORSHeaders(),
	});
  }
  
  // Helper function to create CORS headers
  function createCORSHeaders() {
	return {
	  'Content-Type': 'application/json',
	  'Access-Control-Allow-Origin': '*',
	  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	  'Access-Control-Allow-Headers': 'Content-Type',
	};
  }
  
  // Function to handle creating a new notification
  async function handleCreateNotification(request, env) {
	try {
	  console.log('Received POST request for creating notification');
  
	  // Check Content-Type header
	  const contentType = request.headers.get('Content-Type') || '';
	  if (!contentType.includes('application/json')) {
		throw new Error('Unsupported Content-Type');
	  }
  
	  // Parse request JSON
	  const requestData = await request.json();
	  console.log('Parsed request JSON:', requestData);
  
	  const { message, type } = requestData;
	  if (!message || !type) {
		throw new Error('Missing required fields: message or type');
	  }
  
	  // Prepare notification data
	  const notificationId = `notification-${Date.now()}`;
	  const timestamp = new Date().toISOString();
	  const notification = {
		message,
		type,
		timestamp,
		unread: true,
	  };
  
	  // Attempt to store notification in KV namespace
	  console.log('Storing notification in KV:', notification);
	  await env.FULLNOTIS.put(notificationId, JSON.stringify(notification));
	  console.log('Notification stored successfully in KV');
  
	  // Return success response
	  return new Response(JSON.stringify({ success: true }), {
		headers: createCORSHeaders(),
	  });
	} catch (error) {
	  console.error('Error in handleCreateNotification:', error);
	  return new Response(
		JSON.stringify({ success: false, error: error.message }),
		{
		  status: 500,
		  headers: createCORSHeaders(),
		}
	  );
	}
  }
  
  // Function to handle retrieving notifications
  async function handleGetNotifications(env) {
	try {
	  console.log('Received GET request for fetching notifications');
  
	  const notifications = [];
	  const list = await env.FULLNOTIS.list();
  
	  for (const item of list.keys) {
		const notification = await env.FULLNOTIS.get(item.name, { type: 'json' });
		if (notification && notification.unread) {
		  notifications.push(notification);
		}
	  }
  
	  console.log('Fetched notifications:', notifications);
  
	  return new Response(JSON.stringify(notifications), {
		headers: createCORSHeaders(),
	  });
	} catch (error) {
	  console.error('Error in handleGetNotifications:', error);
	  return new Response(
		JSON.stringify({ success: false, error: error.message }),
		{
		  status: 500,
		  headers: createCORSHeaders(),
		}
	  );
	}
  }
  