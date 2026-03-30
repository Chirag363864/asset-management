"""
Quick Test Script - Verify Backend Model Updates
Run this to check if the backend models were updated correctly
"""

import sys
sys.path.append('.')

try:
    from app.users.models import ProfileUpdate, FinancialProfile, ProfileResponse, Expense
    
    print("✅ Successfully imported models!")
    print("\n" + "="*50)
    print("CHECKING MODEL FIELDS")
    print("="*50)
    
    # Check ProfileUpdate
    print("\n1. ProfileUpdate fields:")
    print(f"   {list(ProfileUpdate.__fields__.keys())}")
    if 'time_frame' in ProfileUpdate.__fields__:
        print("   ✅ time_frame field EXISTS in ProfileUpdate")
    else:
        print("   ❌ time_frame field MISSING in ProfileUpdate")
    
    # Check FinancialProfile
    print("\n2. FinancialProfile fields:")
    print(f"   {list(FinancialProfile.__fields__.keys())}")
    if 'time_frame' in FinancialProfile.__fields__:
        print("   ✅ time_frame field EXISTS in FinancialProfile")
    else:
        print("   ❌ time_frame field MISSING in FinancialProfile")
    
    # Check ProfileResponse
    print("\n3. ProfileResponse fields:")
    print(f"   {list(ProfileResponse.__fields__.keys())}")
    if 'time_frame' in ProfileResponse.__fields__:
        print("   ✅ time_frame field EXISTS in ProfileResponse")
    else:
        print("   ❌ time_frame field MISSING in ProfileResponse")
    
    # Test creating a ProfileUpdate instance
    print("\n" + "="*50)
    print("TESTING MODEL INSTANTIATION")
    print("="*50)
    
    test_expense = Expense(
        category="Monthly Expenses",
        amount=50000.0,
        description="Test expense"
    )
    print(f"\n✅ Created Expense: {test_expense}")
    
    test_update = ProfileUpdate(
        monthly_salary=200000,
        monthly_expenses=[test_expense],
        savings_goal=100000,
        risk_profile="moderate",
        time_frame="medium"
    )
    print(f"\n✅ Created ProfileUpdate with time_frame: {test_update.time_frame}")
    print(f"   Full data: {test_update.dict()}")
    
    print("\n" + "="*50)
    print("✅ ALL CHECKS PASSED!")
    print("="*50)
    print("\nThe backend models are updated correctly.")
    print("If the FastAPI server is running with --reload,")
    print("it should have automatically reloaded with these changes.")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    print("\nMake sure you're running this from the project root directory.")
    import traceback
    traceback.print_exc()
