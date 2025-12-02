/**
 * Test script to verify Supabase connection
 * Run with: bun run scripts/test-supabase-connection.ts
 */

import { supabase } from '../lib/supabase';

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test posts table
    console.log('📝 Testing posts table...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, slug')
      .limit(5);

    if (postsError) {
      console.error('❌ Posts query failed:', postsError.message);
    } else {
      console.log(`✅ Posts table accessible (${posts?.length || 0} posts found)`);
      if (posts && posts.length > 0) {
        console.log('   Sample:', (posts[0] as any).title);
      }
    }

    // Test projects table
    console.log('\n🚀 Testing projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, title, category')
      .limit(5);

    if (projectsError) {
      console.error('❌ Projects query failed:', projectsError.message);
    } else {
      console.log(`✅ Projects table accessible (${projects?.length || 0} projects found)`);
      if (projects && projects.length > 0) {
        console.log('   Sample:', (projects[0] as any).title);
      }
    }

    // Test github_projects table
    console.log('\n🐙 Testing github_projects table...');
    const { data: githubProjects, error: githubError } = await supabase
      .from('github_projects')
      .select('id, repo_name, stars')
      .limit(5);

    if (githubError) {
      console.error('❌ GitHub projects query failed:', githubError.message);
    } else {
      console.log(`✅ GitHub projects table accessible (${githubProjects?.length || 0} repos found)`);
      if (githubProjects && githubProjects.length > 0) {
        console.log('   Sample:', (githubProjects[0] as any).repo_name);
      }
    }

    console.log('\n✨ Connection test complete!');
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    console.log('\n💡 Make sure you have:');
    console.log('   1. Created a Supabase project');
    console.log('   2. Executed the schema.sql file');
    console.log('   3. Set up your .env.local file with correct credentials');
    process.exit(1);
  }
}

testConnection();
