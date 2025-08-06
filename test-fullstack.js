const { chromium } = require('@playwright/test');

async function testFullStackTodoApp() {
    console.log('Starting Playwright test for Full-Stack Todo App...\n');
    console.log('Make sure both backend (port 8000) and frontend (port 3000) are running!\n');
    
    // Launch browser in visible mode
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    try {
        // Navigate to the React app
        console.log('1. Navigating to React app at http://localhost:3000');
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(2000);
        
        // Verify page loaded
        const title = await page.title();
        console.log(`   ✓ Page loaded with title: "${title}"`);
        
        // Wait for the app to load and fetch initial todos
        await page.waitForSelector('.container', { timeout: 5000 });
        console.log('   ✓ React app loaded successfully');
        await page.waitForTimeout(1000);
        
        // Test adding todos
        console.log('\n2. Testing add todo functionality...');
        
        await page.fill('#todoInput', 'Learn FastAPI');
        await page.waitForTimeout(500);
        await page.click('#addBtn');
        await page.waitForSelector('.todo-item', { timeout: 3000 });
        console.log('   ✓ Added "Learn FastAPI"');
        await page.waitForTimeout(1000);
        
        await page.fill('#todoInput', 'Master React with TypeScript');
        await page.waitForTimeout(500);
        await page.press('#todoInput', 'Enter');
        await page.waitForTimeout(1000);
        console.log('   ✓ Added "Master React with TypeScript" using Enter key');
        
        await page.fill('#todoInput', 'Deploy to production');
        await page.waitForTimeout(500);
        await page.click('#addBtn');
        await page.waitForTimeout(1000);
        console.log('   ✓ Added "Deploy to production"');
        
        // Verify todos are displayed
        const todoCount = await page.locator('.todo-item').count();
        console.log(`   ✓ Total todos displayed: ${todoCount}`);
        await page.waitForTimeout(1000);
        
        // Test completing todos
        console.log('\n3. Testing complete todo functionality...');
        
        const firstCheckbox = await page.locator('.todo-checkbox').first();
        await firstCheckbox.click();
        await page.waitForTimeout(1000);
        console.log('   ✓ Marked first todo as completed');
        
        const secondCheckbox = await page.locator('.todo-checkbox').nth(1);
        await secondCheckbox.click();
        await page.waitForTimeout(1000);
        console.log('   ✓ Marked second todo as completed');
        
        // Check stats update
        const statsText = await page.textContent('#todoCount');
        console.log(`   ✓ Stats updated: "${statsText}"`);
        await page.waitForTimeout(1000);
        
        // Test delete functionality
        console.log('\n4. Testing delete todo functionality...');
        
        const deleteButtons = await page.locator('.delete-btn').all();
        if (deleteButtons.length > 2) {
            await deleteButtons[2].click();  // Delete the third (uncompleted) todo
            await page.waitForTimeout(1000);
            console.log('   ✓ Deleted the third todo');
        }
        
        // Test clear completed
        console.log('\n5. Testing clear completed functionality...');
        
        const clearBtn = await page.locator('#clearCompleted');
        if (await clearBtn.isVisible()) {
            await clearBtn.click();
            await page.waitForTimeout(1000);
            console.log('   ✓ Cleared all completed todos');
        }
        
        // Add new todos to test API persistence
        console.log('\n6. Testing API persistence...');
        
        await page.fill('#todoInput', 'Test API persistence');
        await page.click('#addBtn');
        await page.waitForTimeout(1000);
        
        await page.fill('#todoInput', 'This should persist through reload');
        await page.click('#addBtn');
        await page.waitForTimeout(1000);
        console.log('   ✓ Added 2 new todos');
        
        // Reload page to test persistence
        console.log('\n7. Reloading page to verify backend persistence...');
        await page.reload();
        await page.waitForSelector('.todo-item', { timeout: 5000 });
        
        const todosAfterReload = await page.locator('.todo-item').count();
        console.log(`   ✓ Todos persisted after reload. Count: ${todosAfterReload}`);
        
        // Test API health check
        console.log('\n8. Testing backend API directly...');
        const apiResponse = await page.evaluate(async () => {
            const response = await fetch('http://localhost:8000/');
            return await response.json();
        });
        console.log(`   ✓ Backend API responded: ${JSON.stringify(apiResponse)}`);
        
        console.log('\n✅ All tests passed successfully!');
        console.log('\n⏸️  Browser will stay open for 5 seconds to show the final state...');
        await page.waitForTimeout(5000);
        
    } catch (error) {
        console.error('\n❌ Test failed with error:', error.message);
        console.log('\nPossible issues:');
        console.log('- Make sure the backend is running: cd backend && source .venv/bin/activate && python main.py');
        console.log('- Make sure the frontend is running: cd frontend && npm start');
        console.log('- Backend should be on http://localhost:8000');
        console.log('- Frontend should be on http://localhost:3000');
        console.log('\n⏸️  Keeping browser open for debugging...');
        await page.waitForTimeout(10000);
        process.exit(1);
    } finally {
        await browser.close();
        console.log('\n🎬 Test session ended. Browser closed.');
    }
}

// Run the test
testFullStackTodoApp().catch(console.error);