import streamlit as st
import pandas as pd
from datetime import datetime
from database import execute_query, execute_update

def show():
    st.title("Payments")
    
    # Create tabs for viewing and adding payments
    tab1, tab2 = st.tabs(["View Payments", "Add Payment"])
    
    with tab1:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("Payment History")
        
        # Filters
        col1, col2 = st.columns(2)
        with col1:
            date_range = st.date_input(
                "Date Range",
                value=(datetime(2023, 1, 1), datetime(2023, 5, 31)),
                max_value=datetime.now()
            )
        
        with col2:
            roommate_filter = st.multiselect(
                "Roommate",
                ["John Smith", "Sarah Johnson", "Mike Williams", "Emily Davis"]
            )
        
        # Get payments data
        # In a real app, this would query the database with filters
        payments = pd.DataFrame({
            'ID': [1, 2, 3, 4, 5],
            'Roommate': ['John Smith', 'Sarah Johnson', 'Mike Williams', 'Emily Davis', 'John Smith'],
            'Amount': [200.00, 150.00, 175.00, 125.00, 180.00],
            'Date': ['2023-05-01', '2023-05-03', '2023-05-05', '2023-05-10', '2023-05-15'],
            'Mode': ['Cash', 'Venmo', 'Bank Transfer', 'Cash', 'Venmo']
        })
        
        # Group by roommate
        st.markdown("### Payments by Roommate")
        
        # Get unique roommates
        roommates = payments['Roommate'].unique()
        
        for roommate in roommates:
            with st.expander(f"{roommate}"):
                roommate_payments = payments[payments['Roommate'] == roommate]
                st.dataframe(roommate_payments[['Date', 'Amount', 'Mode']], use_container_width=True)
                
                total = roommate_payments['Amount'].sum()
                st.markdown(f"**Total Payments:** ${total:.2f}")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    with tab2:
        st.markdown('<div class="card pastel-pink">', unsafe_allow_html=True)
        st.subheader("Add New Payment")
        
        # Form for adding a new payment
        with st.form("add_payment_form"):
            roommate = st.selectbox(
                "Roommate",
                ["John Smith", "Sarah Johnson", "Mike Williams", "Emily Davis"]
            )
            amount = st.number_input("Amount", min_value=0.01, step=10.0)
            date = st.date_input("Date", value=datetime.now())
            mode = st.selectbox(
                "Payment Mode",
                ["Cash", "Venmo", "Bank Transfer", "Credit Card", "Other"]
            )
            
            submitted = st.form_submit_button("Add Payment")
            if submitted:
                if roommate and amount:
                    # In a real app, this would insert into the database
                    # query = "INSERT INTO payment (amount, date, mode, roommate_id) VALUES (%s, %s, %s, %s)"
                    # params = (amount, date, mode, roommate_id)
                    # result = execute_update(query, params)
                    
                    st.success(f"Added payment of ${amount:.2f} from {roommate}")
                else:
                    st.error("Roommate and amount are required")
        
        st.markdown('</div>', unsafe_allow_html=True)
